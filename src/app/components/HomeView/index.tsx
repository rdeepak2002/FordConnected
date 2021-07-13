import React, { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/Foundation';

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
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { AuthContext } from '../../../App';
import { retrieveUserSession } from '../../utilities/userSession';
import { getCarImageFull, getFriends, getVehicles, refreshTokens, updateUserVehicles } from '../../api/api';
import { setUserSession } from '../../redux/actions/UserSessionActions';
import { setVehicles, setCarImage } from '../../redux/actions/VehiclesActions';
import { setFriends } from '../../redux/actions/FriendsActions';
import { DEBUG_MODE, ONE_MINUTE, TEN_SECONDS, THIRTY_SECONDS } from '../../../Constants';

const Tab = createBottomTabNavigator();

const HomeView = (props: any) => {
  const navProps = { independent: true, initialRouteName: 'feed' };
  const { isDark, colors } = useTheme();
  const { signOut } = React.useContext(AuthContext);

  const [initLoad, setInitLoad] = useState<boolean>(false);

  useEffect(() => {
    if (!initLoad) {
      setInitLoad(true);

      if (!props.userSession.current) {
        tokenRetrieve(props, signOut).then(() => {
          if (DEBUG_MODE) console.log('user session loaded');
        });
      }

      if (!props.vehicles.current || !props.vehicles.carImage) {
        loadVehiclesAndCarImage(props).then(() => {
          if (DEBUG_MODE) console.log('vehicles and car image loaded');
        });
      }

      if (!props.friends.current) {
        loadFriends(props).then(() => {
          if (DEBUG_MODE) console.log('friends loaded');
        });
      }
    }

    let updateVehiclesAndCarImageTimer = setTimeout(() => {
      loadVehiclesAndCarImage(props).then(() => {
        if (DEBUG_MODE) console.log('vehicles and car image updated');
      });
    }, TEN_SECONDS);

    let updateFriendsTimer = setTimeout(() => {
      loadFriends(props).then(() => {
        if (DEBUG_MODE) console.log('friends updated');
      });
    }, TEN_SECONDS);

    let updateUserVehiclesTimer = setTimeout(() => {
      updateUserVehicles(props.userSession.current, props).then(() => {
        if (DEBUG_MODE) console.log('user vehicles updated');
      });
    }, THIRTY_SECONDS);

    return () => {
      clearTimeout(updateVehiclesAndCarImageTimer);
      clearTimeout(updateFriendsTimer);
      clearTimeout(updateUserVehiclesTimer);
    };
  }, [initLoad, props.userSession.current, props.vehicles.current, props.vehicles.carImage, props.friends.current]);

  return (
    <NavigationContainer {...navProps} theme={isDark ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: colors.navbarItemActiveTint,
          inactiveTintColor: colors.navbarItemInactiveTint,
          style: {
            backgroundColor: colors.navbarBg,
          }
        }}
      >
        <Tab.Screen
          name='feed'
          component={FeedViewWrapper}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name='home' color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="map"
          component={MapViewWrapper}
          options={{
            tabBarLabel: 'Discover',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name='magnifying-glass' color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="search"
          component={SearchViewWrapper}
          options={{
            tabBarLabel: 'Friends',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name='torsos-all' color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="settings"
          component={SettingsViewWrapper}
          options={{
            tabBarLabel: 'Preferences',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name='widget' color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export const tokenRetrieve = async (props, signOut) => {
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
        await refreshTokens(userSession, props).then(([data, error]) => {
          if (error) {
            console.error('REFRESH TOKEN ERROR', 'SERVER ERROR');
            console.error(error);
          }
          else if (!data) {
            console.error('REFRESH TOKEN ERROR', 'APP ERROR');
          }
        });
      }
    }
  } catch (e) {
    console.error(e);
  }
};

export const loadVehiclesAndCarImage = async (props: any) => {
  const userSession = await retrieveUserSession();
  setUserSession(userSession);

  let vehicles = undefined;

  if (userSession) {
    // get vehicles
    await getVehicles(userSession, props).then(([data, error]) => {
      if (error) {
        console.error('GET VEHICLES ERROR', 'SERVER ERROR');
        console.error(error);
      }
      else if (data) {
        vehicles = data;
        props.setVehicles(data);
      }
      else {
        console.error('GET VEHICLES ERROR', 'APP ERROR');
      }
    });

    // set car image data if the function was passed in
    const carImgData = await getCarImageFull(userSession, props, vehicles);
    props.setCarImage(carImgData);
  }
};

export const loadFriends = async (props: any) => {
  const userSession = await retrieveUserSession();
  setUserSession(userSession);

  if (userSession) {
    await getFriends(userSession, props).then(([data, error]) => {
      if (error) {
        console.error('GET FRIENDS ERROR', 'SERVER ERROR');
        console.error(error);
      }
      else if (data) {
        const friendsListNotParsed: any = data;
        let friendsList: Array<any> = [];

        for (let i = 0; i < friendsListNotParsed.length; i++) {
          const person1 = friendsListNotParsed[i].pair[0];
          const person2 = friendsListNotParsed[i].pair[1];
          const friend = (person1.id === userSession.id) ? person2 : person1;
          friendsList.push(friend);
        }

        props.setFriends(friendsList);
      }
      else {
        console.error('GET FRIENDS ERROR', 'APP ERROR');
      }
    });
  }
};

export const mapStateToProps = (state) => {
  const { userSession, vehicles, friends } = state
  return { userSession, vehicles, friends }
};

export const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setUserSession,
    setVehicles,
    setFriends,
    setCarImage
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);