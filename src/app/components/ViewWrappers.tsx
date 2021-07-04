import React from 'react';

import { AppContext } from '../../App';

import GetStartedView from './GetStartedView';
import HomeView from './HomeView';
import SettingsView from './SettingsView';
import LoginView from './LoginView';

import FeedView from './FeedView';
import MapView from './MapView';
import SearchView from './SearchView';

const GetStartedViewWrapper = ({ navigation }) => (
  <AppContext.Consumer>
    {() => <GetStartedView navigation={navigation} />}
  </AppContext.Consumer>
);

const LoginViewWrapper = ({ navigation }) => (
  <AppContext.Consumer>
    {() => <LoginView navigation={navigation} />}
  </AppContext.Consumer>
);

const HomeViewWrapper = ({ }) => (
  <AppContext.Consumer>{() => <HomeView />}</AppContext.Consumer>
);

const FeedViewWrapper = ({ navigation }) => (
  <AppContext.Consumer>
    {() => <FeedView navigation={navigation} />}
  </AppContext.Consumer>
);

const MapViewWrapper = ({ navigation }) => (
  <AppContext.Consumer>
    {() => <MapView navigation={navigation} />}
  </AppContext.Consumer>
);

const SearchViewWrapper = ({ navigation }) => (
  <AppContext.Consumer>
    {() => <SearchView navigation={navigation} />}
  </AppContext.Consumer>
);

const SettingsViewWrapper = ({ navigation }) => (
  <AppContext.Consumer>
    {() => <SettingsView navigation={navigation} />}
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
