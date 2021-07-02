/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import type { Node } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    useColorScheme,
    Text,
    View,
} from 'react-native';
import queryString from 'query-string';

import {
    Colors,
} from 'react-native/Libraries/NewAppScreen';
import WebView from 'react-native-webview';

const App: () => Node = () => {
    const fordAuthUri = 'https://fordconnect.cv.ford.com/common/login/?make=F&application_id=afdc085b-377a-4351-b23e-5e1d35fb3700&client_id=30990062-9618-40e1-a27b-7c6bcb23658a&response_type=code&state=123&redirect_uri=https%3A%2F%2Flocalhost%3A3000&scope=access';

    const [uri, setUri] = useState<string>(fordAuthUri);
    const [refreshAuthToken, setRefreshAuthToken] = useState<string>(undefined);

    const onNavigationStateChange = (webViewState: any) => {
        const parsedUrl = queryString.parse(webViewState.url);
        const code = parsedUrl.code;

        if (code && code.length > 0) {
            console.log('refresh token', code);
            setRefreshAuthToken(code);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {
                refreshAuthToken
                    ?
                    <View>
                        <Text>Logged In!</Text>
                    </View>
                    :
                    <WebView source={{ uri: uri }} onNavigationStateChange={onNavigationStateChange} javaScriptEnabled={true} domStorageEnabled={true} startInLoadingState={false} style={{ flex: 1, marginTop: 20 }} />
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;
