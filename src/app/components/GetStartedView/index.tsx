import {Button, StyleSheet, SafeAreaView, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../styles/ThemeContext';

const GetStartedView = (props: {navigation: any}) => {
  const {colors} = useTheme();

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
