import React from 'react';

import {Text, SafeAreaView, View} from 'react-native';

const FeedView = (props: {styles: any; navigation: any}) => {
  return (
    <SafeAreaView style={props.styles.container}>
      <View>
        <Text>Feed</Text>
      </View>
    </SafeAreaView>
  );
};

export default FeedView;
