import React from 'react';

import { Button, Text, SafeAreaView, View, ScrollView, Pressable } from 'react-native';
import { AuthContext } from '../../../App';
import { useTheme } from '../../styles/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { connect } from 'react-redux';
import { DEBUG_MODE } from '../../../Constants';
import { mapDispatchToProps, mapStateToProps } from '../HomeView';

const SettingsView = (props: any) => {
  const { styles, isDark } = useTheme();
  const { signOut } = React.useContext(AuthContext);
  const userSession = props.userSession.current;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: '100%', paddingLeft: 30, paddingRight: 30 }}>
        <View>
          <Text style={[styles.text, { textAlign: 'center', fontWeight: 'bold', fontSize: 28, marginTop: 10, marginBottom: 20 }]}>Preferences</Text>

          {
            userSession &&
            <>
              <Text style={[styles.text, { marginBottom: 20, fontSize: 18 }]}>Name: {userSession.firstName} {userSession.lastName}</Text>
              <Text style={[styles.text, { marginBottom: 20, fontSize: 18 }]}>Username: {userSession.username}</Text>
              {
                // DEBUG_MODE &&
                // <>
                //   <Text style={styles.text}>User ID: {userSession.id}</Text>
                //   <Text style={styles.text}>Ford Profile ID: {userSession.fordProfileId}</Text>
                //   <Text style={styles.text}>Access Token Expiry: {new Date(userSession.accessExpiresAtSeconds * 1000).toString()}</Text>
                //   <Text style={styles.text}>Refresh Token Expiry: {new Date(userSession.refreshExpiresAtSeconds * 1000).toString()}</Text>
                // </>
              }
            </>
          }

          <Text style={[styles.text, { marginBottom: 20, fontSize: 18 }]}>Theme: {isDark ? 'Dark' : 'Light'}</Text>

          {/* <ThemeToggle /> */}
        </View>

        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 'auto', marginBottom: '10%' }}>
          <Pressable
            style={[styles.button, { backgroundColor: '#f25b50', width: '50%' }]}
            onPress={() => {
              signOut();
            }}
          >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Log Out</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);
