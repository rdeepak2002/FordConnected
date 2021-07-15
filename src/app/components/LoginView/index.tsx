import { Button, StyleSheet, SafeAreaView, Text, View, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';

import React from 'react';
import queryString from 'query-string';
import WebView from 'react-native-webview';
import { TextInput } from 'react-native-gesture-handler';
import { AuthContext } from '../../../App';
import { useTheme } from '../../styles/ThemeContext';
import { connect } from 'react-redux';
import { loginUser } from '../../api/api';
import { mapDispatchToProps, mapStateToProps } from '../HomeView';

const LoginView = (props: any) => {
  const authState = '27252';
  const fordAuthUri = `https://fordconnect.cv.ford.com/common/login/?make=F&application_id=afdc085b-377a-4351-b23e-5e1d35fb3700&client_id=30990062-9618-40e1-a27b-7c6bcb23658a&response_type=code&state=${authState}&redirect_uri=https%3A%2F%2Flocalhost%3A3000&scope=access`;

  const [uri, setUri] = useState<string>(fordAuthUri);
  const [code, setCode] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [firstName, setFirstname] = useState<string>('');
  const [lastName, setLastname] = useState<string>('');
  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  const { signIn } = React.useContext(AuthContext);
  const { styles } = useTheme();

  let webView;

  const onNavigationStateChange = (webViewState: any) => {
    const parsedUrl = queryString.parse(webViewState.url);

    const code = parsedUrl.code;
    const state = parsedUrl['https://localhost:3000/?state'];

    if (code && state && code.length > 0 && state === authState) {
      setCode(code as string);
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
    else {
      setUri(fordAuthUri);

      console.error('error getting Ford username');

      Alert.alert(
        'Error Loggin In',
        'Please try again',
        [
          { text: 'OK', onPress: (() => { }) },
        ],
        { cancelable: false },
      );
    }
  };

  const register = () => {
    if (
      !loggingIn &&
      code &&
      username &&
      firstName &&
      lastName &&
      firstName.length > 0 &&
      lastName.length > 0
    ) {
      setLoggingIn(true);
      // call server to login or register the user
      loginUser(username, firstName, lastName, code).then(([data, error]) => {
        if (error) {
          console.error('LOGIN ERROR', 'SERVER ERROR');
          console.error(error);
          setLoggingIn(false);
        }
        else if (data) {
          const id = data.userId;
          const fordProfileId = data.fordProfileId;
          const accessToken = data.accessToken;
          const accessExpiresAtSeconds = parseInt(data.accessExpiresAtSeconds);
          const refreshToken = data.refreshToken;
          const refreshExpiresAtSeconds = parseInt(data.refreshExpiresAtSeconds);

          props.setUserSession({ id: id, username: username, firstName: firstName, lastName: lastName, refreshToken: refreshToken, accessToken: accessToken, fordProfileId: fordProfileId, accessExpiresAtSeconds: accessExpiresAtSeconds, refreshExpiresAtSeconds: refreshExpiresAtSeconds });

          signIn(id, username, firstName, lastName, refreshToken, accessToken, fordProfileId, accessExpiresAtSeconds, refreshExpiresAtSeconds);
          setLoggingIn(false);

          setCode('');
          setUsername('');
          setFirstname('');
          setLastname('');
        }
        else {
          console.error('LOGIN ERROR', 'APP ERROR');
          setLoggingIn(false);
        }
      });
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(injectScriptTimer);
    };
  }, [injectScriptTimer]);

  return (
    <SafeAreaView style={styles.container}>
      {(code.length === 0 || username.length === 0) &&
        <WebView
          onMessage={handleSubmitBtn}
          ref={ref => (webView = ref)}
          source={{ uri: uri }}
          onNavigationStateChange={onNavigationStateChange}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          style={styles.webView}
          onError={() => {
            setUri(fordAuthUri);
            console.error('webpage error');
            Alert.alert(
              'Error Loggin In',
              'Please try again',
              [
                { text: 'OK', onPress: (() => { }) },
              ],
              { cancelable: false },
            );
          }}
        />
      }

      {(code.length > 0 && username.length > 0) &&
        <View style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>{'First Name'}</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChange={event => setFirstname(event.nativeEvent.text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.text}>{'Last Name'}</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChange={event => setLastname(event.nativeEvent.text)}
            />
          </View>

          <Pressable
            style={[styles.button, styles.loginBtn]}
            onPress={register}
          >
            {loggingIn
              ?
              <ActivityIndicator size='small' color='white' />
              :
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Login</Text>
            }
          </Pressable>
        </View>
      }
    </SafeAreaView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);