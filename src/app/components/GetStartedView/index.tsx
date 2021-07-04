import { Button, SafeAreaView, View } from 'react-native';
import React from 'react';

const GetStartedView = (props: { styles: any, navigation: any }) => {
    return (
        <SafeAreaView style={props.styles.container}>
            <View>
                <Button title='Get Started' onPress={() => {
                    props.navigation.navigate('login');
                }} />
            </View>
        </SafeAreaView>
    );
}

export default GetStartedView;