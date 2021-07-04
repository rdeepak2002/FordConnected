import React from 'react';

import {Text, StyleSheet, SafeAreaView, View} from 'react-native';

import {useTheme} from '../../styles/ThemeContext';

const SearchView = () => {
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
        <Text>Search</Text>
      </View>
    </SafeAreaView>
  );
};

export default SearchView;
