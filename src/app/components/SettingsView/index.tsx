import React from 'react';

import { Button, Text, SafeAreaView, View, ScrollView } from 'react-native';
import { AuthContext } from '../../../App';
import { useTheme } from '../../styles/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { connect } from 'react-redux';

const SettingsView = (props: any) => {
  const { styles } = useTheme();
  const { signOut } = React.useContext(AuthContext);
  const userSession = props.userSession.current ? JSON.parse(props.userSession.current) : undefined;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.text}>Settings</Text>

        {
          userSession &&
          <>
            <Text style={styles.text}>Username: {userSession.username}</Text>
            <Text style={styles.text}>Name: {userSession.firstName} {userSession.lastName}</Text>
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