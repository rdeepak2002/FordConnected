import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import {
  removeUserSession,
  retrieveUserSession,
  storeUserSession,
} from './app/utilities/userSession';
import {
  GetStartedViewWrapper,
  HomeViewWrapper,
  LoginViewWrapper,
} from './app/components/ViewWrappers';
import { navigateRoot, navigationRef } from './app/components/RootNavigation';
import { Appearance, AppearanceProvider } from 'react-native-appearance';
import { useTheme } from './app/styles/ThemeContext';
import { ThemeProvider } from './app/styles/ThemeContext';

const Stack = createStackNavigator();
const AppContext = React.createContext(undefined);
const AuthContext = React.createContext(undefined);

const App = () => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userSession: action.userSession,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            userSession: action.userSession,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            userSession: null,
          };
      }
    },
    {
      isLoading: true,
      userSession: null,
    },
  );

  const { isDark, setScheme } = useTheme();

  React.useEffect(() => {
    Appearance.addChangeListener(({ colorScheme }) => {
      setScheme('dark');
    });

    // Fetch the token from storage then navigate to our appropriate place
    const tokenRetrieve = async () => {
      let userSession;

      try {
        userSession = await retrieveUserSession();
      } catch (e) {
        console.error(e);
      }

      dispatch({ type: 'RESTORE_TOKEN', userSession: userSession });
    };

    tokenRetrieve();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (
        id: string,
        username: string,
        firstName: string,
        lastName: string,
        refreshToken: string,
        accessToken: string,
      ) => {
        await storeUserSession(
          id,
          username,
          firstName,
          lastName,
          refreshToken,
          accessToken,
        )
          .then(() => {
            let userSession;

            try {
              userSession = retrieveUserSession();
            } catch (e) {
              console.error(e);
            }

            navigateRoot('home');
            dispatch({ type: 'SIGN_IN', userSession: userSession });
          })
          .catch(error => {
            console.error(error);
          });
      },
      signOut: async () => {
        await removeUserSession();
        navigateRoot('get_started');
        dispatch({ type: 'SIGN_OUT' });
      },
    }),
    [],
  );

  if (state.isLoading) {
    // We haven't finished checking for the token yet
    return <></>;
  }

  return (
    <AppearanceProvider>
      <ThemeProvider>
        <AuthContext.Provider value={authContext as any}>
          <NavigationContainer ref={navigationRef} theme={isDark ? DarkTheme : DefaultTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {state.userSession == null ? (
                <>
                  <Stack.Screen
                    name={'get_started'}
                    component={GetStartedViewWrapper}
                  />
                  <Stack.Screen name={'login'} component={LoginViewWrapper} />
                  <Stack.Screen name={'home'} component={HomeViewWrapper} />
                </>
              ) : (
                <>
                  <Stack.Screen name={'home'} component={HomeViewWrapper} />
                  <Stack.Screen
                    name={'get_started'}
                    component={GetStartedViewWrapper}
                  />
                  <Stack.Screen name={'login'} component={LoginViewWrapper} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </AuthContext.Provider>
      </ThemeProvider>
    </AppearanceProvider>
  );
};

export { AppContext, AuthContext };
export default App;
