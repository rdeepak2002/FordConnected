import React from 'react';

import { Text, SafeAreaView, View } from 'react-native';

const MapView = (props: { styles: any, navigation: any }) => {
    return (
        <SafeAreaView style={props.styles.container}>
            <View>
                <Text>Map</Text>
            </View>
        </SafeAreaView>
    );
}

export default MapView;