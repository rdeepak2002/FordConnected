import { Button, SafeAreaView, View } from 'react-native';
import React from 'react';
import { useTheme } from '../../styles/ThemeContext';

const GetStartedView = (props: { navigation: any }) => {
  const { styles } = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Button
          title="Get Started"
          onPress={() => {
            props.navigation.navigate('login');
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default GetStartedView;
