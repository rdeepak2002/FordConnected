import React from 'react';

import { Button, Text, StyleSheet, SafeAreaView, View, Switch } from 'react-native';
import { AuthContext } from '../../../App';
import { useTheme } from '../../styles/ThemeContext';

const SettingsView = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
    },
  });

  const { signOut } = React.useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Settings</Text>
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
