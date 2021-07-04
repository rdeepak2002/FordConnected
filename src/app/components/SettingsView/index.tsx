import React from 'react';

import { Button, Text, SafeAreaView, View } from 'react-native';
import { AuthContext } from '../../../App';
import { useTheme } from '../../styles/ThemeContext';

const SettingsView = () => {
  const { styles } = useTheme();
  const { signOut } = React.useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.text}>Settings</Text>
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

export default SettingsView;
