import { Image, Text, ImageBackground, Pressable, SafeAreaView, View, Dimensions } from 'react-native';
import React from 'react';
import { useTheme } from '../../styles/ThemeContext';

const GetStartedView = (props: { navigation: any }) => {
  const { styles } = useTheme();

  const dimensions = Dimensions.get('window');
  const imageHeight = Math.round(dimensions.width * 9 / 16);
  const imageWidth = dimensions.width;

  return (
    <View>
      <ImageBackground source={require('../../assets/background2.jpg')} style={{ width: '100%', height: '100%' }} />

      <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.2)' }}>
        <SafeAreaView style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
          <Image resizeMode='contain' style={{ width: imageWidth*1.1, height: imageHeight*0.7, marginTop: 100 }} source={require('../../assets/Ford-grey.png')} />
          <Image resizeMode='contain' style={{ width: imageWidth*0.7, height: imageHeight*0.2 }} source={require('../../assets/connected-white.png')} />

          <Pressable
            style={[styles.button, { width: 200, backgroundColor: 'rgba(255,255,255,0.9)', marginTop: 'auto', marginBottom: 100, padding: 20 }]}
            onPress={() => { props.navigation.navigate('login'); }}
          >
            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 25, width: '100%', textAlign: 'center' }}>Get Started</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    </View >
  );
};

export default GetStartedView;
