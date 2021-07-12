import React from 'react';
import GetStartedView from './GetStartedView';
import HomeView from './HomeView';
import SettingsView from './SettingsView';
import LoginView from './LoginView';
import FeedView from './FeedView';
import SearchView from './SearchView';
import MapViewScreen from './MapView';

import { AppContext } from '../../App';

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
    {() => <MapViewScreen />}
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
