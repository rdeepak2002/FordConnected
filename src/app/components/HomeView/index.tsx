import React from 'react';

import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  FeedViewWrapper,
  MapViewWrapper,
  SearchViewWrapper,
  SettingsViewWrapper,
} from '../ViewWrappers';
import { useTheme } from '../../styles/ThemeContext';

const Tab = createBottomTabNavigator();

const HomeView = () => {
  const navProps = { independent: true, initialRouteName: 'feed' };
  const { isDark } = useTheme();

  return (
    <NavigationContainer {...navProps} theme={isDark ? DarkTheme : DefaultTheme}>
      <Tab.Navigator>
        <Tab.Screen name="feed" component={FeedViewWrapper} />
        <Tab.Screen name="map" component={MapViewWrapper} />
        <Tab.Screen name="search" component={SearchViewWrapper} />
        <Tab.Screen name="settings" component={SettingsViewWrapper} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default HomeView;
