import { Button, StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { useState, useEffect } from 'react';

import React from 'react';
import queryString from 'query-string';
import WebView from 'react-native-webview';
import { TextInput } from 'react-native-gesture-handler';
import { AuthContext } from '../../../App';
import { useTheme } from '../../styles/ThemeContext';

const LoginView = (props: { navigation: any }) => {
  const authState = '27252';
  const fordAuthUri = `https://fordconnect.cv.ford.com/common/login/?make=F&application_id=afdc085b-377a-4351-b23e-5e1d35fb3700&client_id=30990062-9618-40e1-a27b-7c6bcb23658a&response_type=code&state=${authState}&redirect_uri=https%3A%2F%2Flocalhost%3A3000&scope=access`;

  const [uri] = useState<string>(fordAuthUri);
  const [refreshToken, setRefreshToken] = useState<string>(undefined);
  const [username, setUsername] = useState<string>(undefined);
  const [firstName, setFirstname] = useState<string>('');
  const [lastName, setLastname] = useState<string>('');

  const { signIn } = React.useContext(AuthContext);
  const { styles } = useTheme();

  let webView;


  const onNavigationStateChange = (webViewState: any) => {
    const parsedUrl = queryString.parse(webViewState.url);

    const code = parsedUrl.code;
    const state = parsedUrl['https://localhost:3000/?state'];

    if (code && state && code.length > 0 && state === authState) {
      setRefreshToken(code as string);
    }
  };

  let injectScriptTimer = setTimeout(() => {
    let injectedJavaScript = `
            function run() {
                let loginBtn = document.getElementById('btnLogin');

                if(loginBtn) {
                    let usernameFields = document.getElementsByName('username');
                    let usernameField = usernameFields[0];

                    loginBtn.addEventListener('click', function(){ 
                        window.ReactNativeWebView.postMessage(usernameField.value);
                    });
                }
            }

            run();

            true;
        `;

    if (webView) {
      webView.injectJavaScript(injectedJavaScript);
    }
  }, 3000);

  const handleSubmitBtn = (event: any) => {
    if (event && event.nativeEvent && event.nativeEvent.data) {
      setUsername(event.nativeEvent.data);
    }
  };

  const register = () => {
    if (
      refreshToken &&
      username &&
      firstName &&
      lastName &&
      firstName.length > 0 &&
      lastName.length > 0
    ) {
      // todo make register post here then save to storage after we know id of user in database -> also make request to get access token in server to allow server to know rergister request is real
      const id = 'someId';
      const accessToken = 'someAccessToken';

      signIn(id, username, firstName, lastName, refreshToken, accessToken);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(injectScriptTimer);
    };
  }, [injectScriptTimer]);

  return (
    <SafeAreaView style={styles.container}>
      {!refreshToken && (
        <WebView
          onMessage={handleSubmitBtn}
          ref={ref => (webView = ref)}
          source={{ uri: uri }}
          onNavigationStateChange={onNavigationStateChange}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          style={styles.webView}
        />
      )}

      {refreshToken && username && (
        <View>
          <Text>Other Information</Text>
          <TextInput
            placeholder={'username'}
            value={username}
            style={styles.input}
            editable={false}
          />
          <TextInput
            placeholder={'first name'}
            value={firstName}
            onChange={event => setFirstname(event.nativeEvent.text)}
            style={styles.input}
          />
          <TextInput
            placeholder={'last name'}
            value={lastName}
            onChange={event => setLastname(event.nativeEvent.text)}
            style={styles.input}
          />
          <Button title="Register" onPress={register} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default LoginView;
