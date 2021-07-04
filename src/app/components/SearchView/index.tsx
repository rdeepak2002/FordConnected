import React from 'react';

import { Text, StyleSheet, SafeAreaView, View } from 'react-native';

import { useTheme } from '../../styles/ThemeContext';

const SearchView = (props: { navigation: any }) => {
  const { styles } = useTheme()

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Search</Text>
      </View>
    </SafeAreaView>
  );
};

export default SearchView;
