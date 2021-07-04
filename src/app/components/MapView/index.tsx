import React from 'react';

import { Text, SafeAreaView, View } from 'react-native';
import { useTheme } from '../../styles/ThemeContext';

const MapView = (props: { navigation: any }) => {
  const { styles } = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Map</Text>
      </View>
    </SafeAreaView>
  );
};

export default MapView;
