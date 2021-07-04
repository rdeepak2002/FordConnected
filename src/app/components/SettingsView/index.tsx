import React from 'react';

import { Button, Text, SafeAreaView, View } from 'react-native';
import { AuthContext } from '../../../App';
import { useTheme } from '../../styles/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { connect } from 'react-redux';
import { setUserSession } from '../../redux/actions/UserSessionActions';
import { bindActionCreators } from 'redux';

const SettingsView = (props: any) => {
  const { styles } = useTheme();
  const { signOut } = React.useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.text}>Settings</Text>

        <Text style={styles.text}>{JSON.stringify(props.userSession)}</Text>

        <ThemeToggle />

        <Button
          title="Log Out"
          onPress={() => {
            signOut();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  const { userSession } = state
  return { userSession }
};

export default connect(mapStateToProps)(SettingsView);