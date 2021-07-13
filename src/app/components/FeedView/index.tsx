import React from 'react';
import FullWidthImage from 'react-native-fullwidth-image';
import MaterialCommunityIcons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

import { useState } from 'react';
import { ActivityIndicator, Text, SafeAreaView, View, ScrollView, TouchableWithoutFeedback, TextInput, Pressable } from 'react-native';
import { useTheme } from '../../styles/ThemeContext';
import { bindActionCreators } from 'redux';
import { setUserSession } from '../../redux/actions/UserSessionActions';
import { setVehicles, setCarImage } from '../../redux/actions/VehiclesActions';
import { setFriends } from '../../redux/actions/FriendsActions';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../HomeView';

const FeedView = (props: any) => {
  const { styles, colors, isDark } = useTheme();

  const userSession = props.userSession.current;
  const vehicles = props.vehicles.current;
  const carImgData = props.vehicles.carImage;
  const vehicle = vehicles && vehicles.length > 0 ? vehicles[0] : undefined;

  const [postModalVisible, setPostModalVisible] = useState<boolean>(false);
  const [postTitle, setPostTitle] = useState<string>('');
  const [postBody, setPostBody] = useState<string>('TODO: make this a input box instead of field');
  const [sendingPost, setSendingPost] = useState<boolean>(false);

  let vehicleMake = '';

  if (vehicle) {
    switch (vehicle.make) {
      case 'F':
        vehicleMake = 'Ford';
        break;
      case 'L':
        vehicleMake = 'Lincoln';
        break;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Modal
          isVisible={postModalVisible}
          supportedOrientations={['portrait', 'landscape']}
          backdropOpacity={0.4}
        >
          <TouchableWithoutFeedback onPress={() => { if (!sendingPost) setPostModalVisible(false) }}>
            <View style={[styles.centeredView]}>
              <View style={[styles.modalView, { width: '80%' }]}>
                <View style={[styles.inputContainer, { width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }]}>
                  <TextInput
                    placeholder={'title of post'}
                    value={postTitle}
                    onChange={event => setPostTitle(event.nativeEvent.text)}
                    style={[styles.input, { width: '90%', marginBottom: 20 }]}
                    placeholderTextColor="#474b52"
                  />
                  <TextInput
                    placeholder={'write about anything!'}
                    value={postBody}
                    onChange={event => setPostBody(event.nativeEvent.text)}
                    style={[styles.input, { width: '90%', marginBottom: 20 }]}
                    placeholderTextColor="#474b52"
                  />
                </View>
                <Pressable
                  style={[styles.button, styles.sendRequestBtn]}
                  onPress={() => {
                    setSendingPost(true);
                    console.log("TODO: make request to send post");
                  }}
                >
                  {
                    sendingPost
                      ?
                      <ActivityIndicator size='small' color='white' />
                      :
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>Send</Text>
                  }
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
      {(userSession && vehicle && carImgData)
        ?
        <ScrollView style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
          <FullWidthImage source={{ uri: carImgData }} />
          <Text style={[styles.text, { textAlign: 'center', fontWeight: 'bold', fontSize: 25, marginTop: 20 }]}>{userSession.firstName}'s {vehicle.modelYear} {vehicleMake} {vehicle.modelName}</Text>
        </ScrollView>
        :
        <View style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='large' color={colors.activityIndicator} />
        </View>
      }

      {(userSession && vehicle && carImgData && !postModalVisible) &&
        <Pressable onPress={() => { setPostModalVisible(true) }} style={[styles.postBtnContainer]}>
          <MaterialCommunityIcons style={{ elevation: 3 }} name='create' color={colors.createPostGlyph} size={40} />
        </Pressable>
      }
    </SafeAreaView >
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedView);
