import React from 'react';

import {Text, StyleSheet, SafeAreaView, View} from 'react-native';
import {useTheme} from '../../styles/ThemeContext';

const FeedView = (props: { navigation: any }) => {
  const {colors} = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    input: {
      color: colors.text,
      height: 40,
      margin: 12,
      borderWidth: 1,
    },
    text: {
      color: colors.text,
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.text}>Feed</Text>
      </View>
    </SafeAreaView>
  );
};

export default FeedView;
