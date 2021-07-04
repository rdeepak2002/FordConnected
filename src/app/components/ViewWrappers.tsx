import React from 'react';

import { AppContext } from "../../App";

import GetStartedView from './GetStartedView';
import HomeView from './HomeView';
import SettingsView from './SettingsView';
import LoginView from './LoginView';

import styles from "../styles/styles";

const GetStartedViewWrapper = ({ navigation, route }) => (
    <AppContext.Consumer>
        {() => (
            <GetStartedView styles={styles} navigation={navigation} />
        )}
    </AppContext.Consumer>
);

const LoginViewWrapper = ({ navigation, route }) => (
    <AppContext.Consumer>
        {() => (
            <LoginView styles={styles} navigation={navigation} />
        )}
    </AppContext.Consumer>
);

const HomeViewWrapper = ({ navigation, route }) => (
    <AppContext.Consumer>
        {() => (
            <HomeView styles={styles} navigation={navigation} />
        )}
    </AppContext.Consumer>
);

const FeedViewWrapper = ({ navigation, route }) => (
    <AppContext.Consumer>
        {() => (
            <SettingsView styles={styles} navigation={navigation} />
        )}
    </AppContext.Consumer>
);

const MapViewWrapper = ({ navigation, route }) => (
    <AppContext.Consumer>
        {() => (
            <SettingsView styles={styles} navigation={navigation} />
        )}
    </AppContext.Consumer>
);

const SearchViewWrapper = ({ navigation, route }) => (
    <AppContext.Consumer>
        {() => (
            <SettingsView styles={styles} navigation={navigation} />
        )}
    </AppContext.Consumer>
);

const SettingsViewWrapper = ({ navigation, route }) => (
    <AppContext.Consumer>
        {() => (
            <SettingsView styles={styles} navigation={navigation} />
        )}
    </AppContext.Consumer>
);

export { GetStartedViewWrapper, LoginViewWrapper, HomeViewWrapper, FeedViewWrapper, MapViewWrapper, SearchViewWrapper, SettingsViewWrapper };