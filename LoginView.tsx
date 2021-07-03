import React from 'react';
import queryString from 'query-string';
import WebView from 'react-native-webview';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';

const LoginView = (props: {styles: any, navigation: any}) => {
    const authState = '27252';
    const fordAuthUri = `https://fordconnect.cv.ford.com/common/login/?make=F&application_id=afdc085b-377a-4351-b23e-5e1d35fb3700&client_id=30990062-9618-40e1-a27b-7c6bcb23658a&response_type=code&state=${authState}&redirect_uri=https%3A%2F%2Flocalhost%3A3000&scope=access`;

    const [uri, setUri] = useState<string>(fordAuthUri);
    const [refreshAuthToken, setRefreshAuthToken] = useState<string>(undefined);
    const [email, setEmail] = useState<string>('rdeepak2002@gmail.com');
    const [password, setPassword] = useState<string>('Deeban246!');

    let webView = undefined;

    const onNavigationStateChange = (webViewState: any) => {
        const parsedUrl = queryString.parse(webViewState.url);

        const code = parsedUrl.code;
        const state = parsedUrl['https://localhost:3000/?state'];

        if (code && state && code.length > 0 && state === authState) {
            setRefreshAuthToken(code);
        }
    }

    const timer = setTimeout(() => {
        if (webView) webView.injectJavaScript(injectedJavaScript);
    }, 3000);

    useEffect(
        () => {
            return () => {
                clearTimeout(timer);
            };
        },
        []
    );

    const injectedJavaScript = `
        function run() {
            let usernameFields = document.getElementsByName('username');
            let passwordFields = document.getElementsByName('password');

            if(usernameFields && passwordFields && usernameFields.length > 0 && passwordFields.length > 0) {
                let usernameField = usernameFields[0];
                let passwordField = passwordFields[0];
                let loginBtn = document.getElementById('btnLogin');

                usernameField.value = '${email}';
                passwordField.value = '${password}';

                loginBtn.disabled = false;
                loginBtn.click();
            }

            true;
        }

        run();

        true;
    `;

    return (
        <SafeAreaView style={props.styles.container}>
            {(refreshAuthToken) &&
                <View>
                    <Text>Logged In!</Text>
                </View>
            }

            {(!refreshAuthToken) &&
                <WebView ref={ref => (webView = ref)} source={{ uri: uri }} onNavigationStateChange={onNavigationStateChange} javaScriptEnabled={true} domStorageEnabled={true} startInLoadingState={false} style={{ flex: 1, marginTop: 20 }} />
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default LoginView;
