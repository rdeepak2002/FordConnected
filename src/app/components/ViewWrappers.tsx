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

const LoginViewWrapper = ({ }) => (
  <AppContext.Consumer>
    {() => <LoginView />}
  </AppContext.Consumer>
);

const HomeViewWrapper = ({ }) => (
  <AppContext.Consumer>{() => <HomeView />}</AppContext.Consumer>
);

const FeedViewWrapper = ({ }) => (
  <AppContext.Consumer>
    {() => <FeedView />}
  </AppContext.Consumer>
);

const MapViewWrapper = ({ }) => (
  <AppContext.Consumer>
    {() => <MapView />}
  </AppContext.Consumer>
);

const SearchViewWrapper = ({ }) => (
  <AppContext.Consumer>
    {() => <SearchView />}
  </AppContext.Consumer>
);

const SettingsViewWrapper = ({ }) => (
  <AppContext.Consumer>
    {() => <SettingsView />}
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
