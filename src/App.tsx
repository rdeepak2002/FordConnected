import type { Node } from 'react';

import { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { removeUserSession, retrieveUserSession, storeUserSession } from './app/utilities/userSession';
import { Text } from 'react-native';

import React from 'react';
import LoginView from './app/components/LoginView';

import styles from './app/styles/styles';
import GetStartedView from './app/components/GetStartedView';
import FeedView from './app/components/FeedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import View from 'react-native-gesture-handler/lib/typescript/GestureHandlerRootView';

const Stack = createStackNavigator();
const AppContext = React.createContext();
const AuthContext = React.createContext();

const App: () => Node = () => {
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
        }
    );


    React.useEffect(() => {
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
            signIn: async (id: string, username: string, firstName: string, lastName: string, refreshToken: string, accessToken: string, navigation?: any) => {
                await storeUserSession(id, username, firstName, lastName, refreshToken, accessToken).then(() => {
                    if (navigation) {
                        navigation.navigate('feed');
                    }
                }).catch((error) => {
                    console.error(error);
                });

                let userSession;

                try {
                    userSession = await retrieveUserSession();
                } catch (e) {
                    console.error(e);
                }

                dispatch({ type: 'SIGN_IN', userSession: userSession });
            },
            signOut: async (navigation: any) => {
                await removeUserSession();
                navigation.navigate('get_started');
                dispatch({ type: 'SIGN_OUT' });
            }
        }),
        []
    );

    if (state.isLoading) {
        // We haven't finished checking for the token yet
        return (<SafeAreaView><Text>loading</Text></SafeAreaView>);
    }

    return (
        <>
            <AuthContext.Provider value={authContext}>
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{ headerShown: false }} >
                        {
                            state.userSession == null
                                ?
                                <>
                                    <Stack.Screen name={'get_started'} component={GetStartedViewWrapper} />
                                    <Stack.Screen name={'login'} component={LoginViewWrapper} />
                                    <Stack.Screen name={'feed'} component={FeedViewWrapper} />
                                </>
                                :
                                <>
                                    <Stack.Screen name={'feed'} component={FeedViewWrapper} />
                                    <Stack.Screen name={'get_started'} component={GetStartedViewWrapper} />
                                    <Stack.Screen name={'login'} component={LoginViewWrapper} />
                                </>
                        }
                    </Stack.Navigator>
                </NavigationContainer>
            </AuthContext.Provider>
        </>

    );
};

const GetStartedViewWrapper = ({ navigation, route }) => (
    <AppContext.Consumer>
        {() => (
            <GetStartedView styles={styles} navigation={navigation} />
        )}
    </AppContext.Consumer>
);

const LoginViewWrapper = ({ navigation, route }) => (
    <AppContext.Consumer>
        {() => (
            <LoginView styles={styles} navigation={navigation} />
        )}
    </AppContext.Consumer>
);

const FeedViewWrapper = ({ navigation, route }) => (
    <AppContext.Consumer>
        {() => (
            <FeedView styles={styles} navigation={navigation} />
        )}
    </AppContext.Consumer>
);

export { AuthContext };
export default App;
