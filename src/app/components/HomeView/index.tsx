import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FeedViewWrapper, MapViewWrapper, SearchViewWrapper, SettingsViewWrapper } from '../ViewWrappers';

const Tab = createBottomTabNavigator();

const HomeView = (props: { styles: any, navigation: any }) => {
    return (
        <NavigationContainer independent={true} initialRouteName="feed">
            <Tab.Navigator>
                <Tab.Screen name="feed" component={FeedViewWrapper} />
                <Tab.Screen name="map" component={MapViewWrapper} />
                <Tab.Screen name="search" component={SearchViewWrapper} />
                <Tab.Screen name="settings" component={SettingsViewWrapper} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default HomeView;