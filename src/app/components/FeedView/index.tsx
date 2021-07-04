import React from 'react';

import { Button, Text, SafeAreaView, View } from 'react-native';
import { removeUserSession } from '../../utilities/userSession';
import { AuthContext } from '../../../App';

const FeedView = (props: { styles: any, navigation: any }) => {
    const { signOut } = React.useContext(AuthContext);

    return (
        <SafeAreaView style={props.styles.container}>
            <View>
                <Text>Welcome!</Text>
                <Button title='Log Out' onPress={() => {
                    signOut(props.navigation);
                }} />
            </View>
        </SafeAreaView>
    );
}

export default FeedView;