import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/Foundation';
import BackgroundTimer from 'react-native-background-timer';

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
import { useState, useEffect } from 'react';
import { AuthContext } from '../../../App';
import { retrieveUserSession } from '../../utilities/userSession';
import { getCarImageFull, getFriends, getPosts, getVehicles, refreshTokens, updateUserVehicles } from '../../api/api';
import { setUserSession } from '../../redux/actions/UserSessionActions';
import { setVehicles, setCarImage } from '../../redux/actions/VehiclesActions';
import { setPosts } from '../../redux/actions/PostsActions';
import { setFriends } from '../../redux/actions/FriendsActions';
import { DEBUG_MODE, FIFTEEN_SECONDS, ONE_MINUTE, TEN_SECONDS, THIRTY_SECONDS } from '../../../Constants';

const Tab = createBottomTabNavigator();

const HomeView = (props: any) => {
  const navProps = { independent: true, initialRouteName: 'feed' };
  const { isDark, colors } = useTheme();
  const { signOut } = React.useContext(AuthContext);

  const [initLoad, setInitLoad] = useState<boolean>(false);
  const [bgTimerInit, setBgTimerInit] = useState<boolean>(false);

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

      if (!props.posts.current) {
        loadPosts(props).then(() => {
          if (DEBUG_MODE) console.log('posts loaded');
        });
      }
    }

    if (!bgTimerInit) {
      console.log('staring background timer');

      setBgTimerInit(true);

      BackgroundTimer.runBackgroundTimer(() => {
        loadVehiclesAndCarImage(props).then(() => {
          if (DEBUG_MODE) console.log('vehicles and car image updated');
        });

        loadFriends(props).then(() => {
          if (DEBUG_MODE) console.log('friends updated');
        });

        updateUserVehiclesOnDemand(props).then(() => {
          if (DEBUG_MODE) console.log('user vehicles updated on demand');
        });

        loadPosts(props).then(() => {
          if (DEBUG_MODE) console.log('posts updated');
        });
      }, TEN_SECONDS);
    }

    // return function cleanup() {
    //   console.log('clearing background timer');
    //   BackgroundTimer.stopBackgroundTimer();
    // };
  }, [initLoad, bgTimerInit]);

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

export const loadPosts = async (props: any) => {
  const userSession = await retrieveUserSession();
  setUserSession(userSession);

  if (userSession) {
    // get posts
    await getPosts(userSession, props).then(([data, error]) => {
      if (error) {
        console.error('GET POSTS ERROR', 'SERVER ERROR');
        console.error(error);
      }
      else if (data) {
        props.setPosts(data);
      }
      else {
        console.error('GET POSTS ERROR', 'APP ERROR');
      }
    });
  }
}

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

export const updateUserVehiclesOnDemand = async (props: any) => {
  const userSession = await retrieveUserSession();
  setUserSession(userSession);

  if (userSession) {
    await updateUserVehicles(userSession, props).then(([response, error]) => {
      if (error) {
        if (DEBUG_MODE) console.log('server error updating user vehicles');
      }
      else if (!response) {
        if (DEBUG_MODE) console.log('app error updating user vehicles');
      }
    }).catch((error) => {
      if (DEBUG_MODE) console.log('app error updating user vehicles');
      if (DEBUG_MODE) console.error(error);
    });
  }
}

export const mapStateToProps = (state) => {
  const { userSession, vehicles, friends, posts } = state
  return { userSession, vehicles, friends, posts }
};

export const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setUserSession,
    setVehicles,
    setFriends,
    setCarImage,
    setPosts
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);