import React from 'react';

import { Text, SafeAreaView, View } from 'react-native';

import { useTheme } from '../../styles/ThemeContext';

const SearchView = () => {
  const { styles } = useTheme()

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.text}>Search</Text>
      </View>
    </SafeAreaView>
  );
};

export default SearchView;
