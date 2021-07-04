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
import { bindActionCreators } from 'redux';
import { setUserSession } from '../../redux/actions/UserSessionActions';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { AuthContext } from '../../../App';
import { retrieveUserSession } from '../../utilities/userSession';

const Tab = createBottomTabNavigator();

const HomeView = (props: any) => {
  const navProps = { independent: true, initialRouteName: 'feed' };
  const { isDark } = useTheme();
  const { signOut } = React.useContext(AuthContext);

  useEffect(() => {
    const tokenRetrieve = async () => {
      let userSession;

      try {
        userSession = await retrieveUserSession();
        if (!userSession) signOut();
        if(!props.userSession.current) {
          props.setUserSession(userSession);
        }
      } catch (e) {
        console.error(e);
      }
    };

    tokenRetrieve();
  }, []);

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

const mapStateToProps = (state) => {
  const { userSession } = state
  return { userSession }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setUserSession,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);