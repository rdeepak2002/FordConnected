import React from 'react';

import type { Node } from 'react';

import { BackHandler, useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { removeUserSession, retrieveUserSession, storeUserSession } from './app/utilities/userSession';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GetStartedViewWrapper, HomeViewWrapper, LoginViewWrapper } from './app/components/ViewWrappers';
import HomeView from './app/components/HomeView';
import { navigateRoot, navigationRef } from './app/components/RootNavigation';

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
            signIn: async (id: string, username: string, firstName: string, lastName: string, refreshToken: string, accessToken: string) => {
                await storeUserSession(id, username, firstName, lastName, refreshToken, accessToken).then(() => {
                    let userSession;

                    try {
                        userSession = retrieveUserSession();
                    } catch (e) {
                        console.error(e);
                    }
                    
                    navigateRoot('home');
                    dispatch({ type: 'SIGN_IN', userSession: userSession });
                }).catch((error) => {
                    console.error(error);
                });
            },
            signOut: async () => {
                await removeUserSession();
                navigateRoot('get_started');
                dispatch({ type: 'SIGN_OUT' });
            }
        }),
        []
    );

    if (state.isLoading) {
        // We haven't finished checking for the token yet
        return (<SafeAreaView></SafeAreaView>);
    }

    return (
        <>
            <AuthContext.Provider value={authContext}>
                <NavigationContainer ref={navigationRef}>
                    <Stack.Navigator screenOptions={{ headerShown: false }} >
                        {
                            state.userSession == null
                                ?
                                <>
                                    <Stack.Screen name={'get_started'} component={GetStartedViewWrapper} />
                                    <Stack.Screen name={'login'} component={LoginViewWrapper} />
                                    <Stack.Screen name={'home'} component={HomeView} />
                                </>
                                :
                                <>
                                    <Stack.Screen name={'home'} component={HomeView} />
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

export { AppContext, AuthContext };
export default App;
