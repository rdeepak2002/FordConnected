import React from 'react';

import {Button, Text, SafeAreaView, View} from 'react-native';
import {AuthContext} from '../../../App';

const SettingsView = (props: {styles: any; navigation: any}) => {
  const {signOut} = React.useContext(AuthContext);

  return (
    <SafeAreaView style={props.styles.container}>
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
