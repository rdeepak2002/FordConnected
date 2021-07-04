import React from 'react';

import {AppContext} from '../../App';

import GetStartedView from './GetStartedView';
import HomeView from './HomeView';
import SettingsView from './SettingsView';
import LoginView from './LoginView';

import styles from '../styles/styles';
import FeedView from './FeedView';
import MapView from './MapView';
import SearchView from './SearchView';

const GetStartedViewWrapper = ({navigation}) => (
  <AppContext.Consumer>
    {() => <GetStartedView styles={styles} navigation={navigation} />}
  </AppContext.Consumer>
);

const LoginViewWrapper = ({navigation}) => (
  <AppContext.Consumer>
    {() => <LoginView styles={styles} navigation={navigation} />}
  </AppContext.Consumer>
);

const HomeViewWrapper = ({navigation}) => (
  <AppContext.Consumer>
    {() => <HomeView styles={styles} navigation={navigation} />}
  </AppContext.Consumer>
);

const FeedViewWrapper = ({navigation}) => (
  <AppContext.Consumer>
    {() => <FeedView styles={styles} navigation={navigation} />}
  </AppContext.Consumer>
);

const MapViewWrapper = ({navigation}) => (
  <AppContext.Consumer>
    {() => <MapView styles={styles} navigation={navigation} />}
  </AppContext.Consumer>
);

const SearchViewWrapper = ({navigation}) => (
  <AppContext.Consumer>
    {() => <SearchView styles={styles} navigation={navigation} />}
  </AppContext.Consumer>
);

const SettingsViewWrapper = ({navigation}) => (
  <AppContext.Consumer>
    {() => <SettingsView styles={styles} navigation={navigation} />}
  </AppContext.Consumer>
);

export {
  GetStartedViewWrapper,
  LoginViewWrapper,
  HomeViewWrapper,
  FeedViewWrapper,
  MapViewWrapper,
  SearchViewWrapper,
  SettingsViewWrapper,
};
