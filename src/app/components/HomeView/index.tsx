import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SettingsViewWrapper } from '../ViewWrappers';

const Tab = createBottomTabNavigator();

const HomeView = (props: { styles: any, navigation: any }) => {
    return (
        <NavigationContainer independent={true} initialRouteName="feed">
            <Tab.Navigator>
                <Tab.Screen name="feed" component={SettingsViewWrapper} />
                <Tab.Screen name="map" component={SettingsViewWrapper} />
                <Tab.Screen name="search" component={SettingsViewWrapper} />
                <Tab.Screen name="settings" component={SettingsViewWrapper} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default HomeView;