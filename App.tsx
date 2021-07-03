import type { Node } from 'react';

import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginView from './LoginView';

const Stack = createStackNavigator();
const AppContext = React.createContext();

const App: () => Node = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >

                <Stack.Screen name={'login'} component={LoginViewWrapper} />


            </Stack.Navigator>
        </NavigationContainer>
    );
};

const LoginViewWrapper = ({ navigation, route }) => (
    <AppContext.Consumer>
        {() => (
            <LoginView styles={styles} navigation={navigation} />
        )}
    </AppContext.Consumer>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;
