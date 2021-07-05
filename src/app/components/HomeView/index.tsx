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
import { refreshTokens } from '../../api/api';

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
        if (!props.userSession.current) {
          // get current timestamp in seconds
          const curTimestampSeconds = Math.floor(new Date().getTime() / 1000);

          // logout if refresh token is expired
          if (curTimestampSeconds >= userSession.refreshExpiresAtSeconds) {
            signOut();
          }
          else {
            // refresh the auth tokens
            refreshTokens(userSession.refreshToken, userSession, props, curTimestampSeconds).then(([data, error]) => {
              if (error) {
                console.error('REFRESH TOKEN ERROR', 'SERVER ERROR');
                console.error(error);
              }
              else if (!data) {
                console.error('REFRESH TOKEN ERROR', 'APP ERROR');
              }
            });
            props.setUserSession(userSession);
          }
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