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
          const curTimestampSeconds = Math.floor(new Date().getTime() / 1000);

          refreshTokens(userSession.refreshToken).then(([data, error]) => {
            if (error) {
              console.error('REFRESH TOKEN ERROR', 'SERVER ERROR');
              console.error(error);
            }
            else if (data) {
              const newAccessToken = data.access_token;
              const newRefreshToken = data.refresh_token;
              const newAccessExpiresAtSeconds = parseInt(data.expires_on);
              const newRefreshExpiresAtSeconds = curTimestampSeconds + parseInt(data.refresh_token_expires_in);

              userSession.accessToken = newAccessToken;
              userSession.refreshToken = newRefreshToken;
              userSession.accessExpiresAtSeconds = newAccessExpiresAtSeconds;
              userSession.refreshExpiresAtSeconds = newRefreshExpiresAtSeconds;

              props.setUserSession(userSession);
            }
            else {
              console.error('REFRESH TOKEN ERROR', 'APP ERROR');
            }
          });
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