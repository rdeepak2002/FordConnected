import React from 'react';

import { Text, SafeAreaView, View } from 'react-native';

const SearchView = (props: { styles: any, navigation: any }) => {
    return (
        <SafeAreaView style={props.styles.container}>
            <View>
                <Text>Search</Text>
            </View>
        </SafeAreaView>
    );
}

export default SearchView;