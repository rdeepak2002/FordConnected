import React from 'react';

import { Button, Text, SafeAreaView, View, ScrollView } from 'react-native';
import { AuthContext } from '../../../App';
import { useTheme } from '../../styles/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { connect } from 'react-redux';
import { DEBUG_MODE } from '../../../Constants';

const SettingsView = (props: any) => {
  const { styles } = useTheme();
  const { signOut } = React.useContext(AuthContext);
  const userSession = props.userSession.current;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.text}>Settings</Text>

        {
          userSession &&
          <>
            <Text style={styles.text}>Username: {userSession.username}</Text>
            <Text style={styles.text}>Name: {userSession.firstName} {userSession.lastName}</Text>
            {
              DEBUG_MODE &&
              <>
                <Text style={styles.text}>User ID: {userSession.id}</Text>
                <Text style={styles.text}>Ford Profile ID: {userSession.fordProfileId}</Text>
                <Text style={styles.text}>Access Token Expiry: {new Date(userSession.accessExpiresAtSeconds * 1000).toString()}</Text>
                <Text style={styles.text}>Refresh Token Expiry: {new Date(userSession.refreshExpiresAtSeconds * 1000).toString()}</Text>
              </>
            }
          </>
        }

        <ThemeToggle />

        <Button
          title="Log Out"
          onPress={() => {
            signOut();
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  const { userSession } = state
  return { userSession }
};

export default connect(mapStateToProps)(SettingsView);