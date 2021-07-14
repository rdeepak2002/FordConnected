import React from 'react';
import FullWidthImage from 'react-native-fullwidth-image';
import MaterialCommunityIcons from 'react-native-vector-icons/FontAwesome5';
import Modal from 'react-native-modal';
import FadeInOut from 'react-native-fade-in-out';
import storage from '@react-native-firebase/storage';
import * as ImagePicker from 'react-native-image-picker';

import { useState, useEffect } from 'react';
import { ActivityIndicator, Text, SafeAreaView, View, ScrollView, TouchableWithoutFeedback, TextInput, Pressable, RefreshControl, Button } from 'react-native';
import { useTheme } from '../../styles/ThemeContext';
import { connect } from 'react-redux';
import { loadPosts, mapDispatchToProps, mapStateToProps } from '../HomeView';
import { createPost } from '../../api/api';
import { DEBUG_MODE } from '../../../Constants';

const FeedView = (props: any) => {
  const { styles, colors, isDark } = useTheme();

  const posts = props.posts.current;
  const userSession = props.userSession.current;
  const vehicles = props.vehicles.current;
  const carImgData = props.vehicles.carImage;
  const vehicle = vehicles && vehicles.length > 0 ? vehicles[0] : undefined;

  const [postModalVisible, setPostModalVisible] = useState<boolean>(false);
  const [postTitle, setPostTitle] = useState<string>('');
  const [postBody, setPostBody] = useState<string>('');
  const [sendingPost, setSendingPost] = useState<boolean>(false);
  const [postsRender, setPostsRender] = useState<any>(undefined);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [scrollPos, setScrollPos] = useState<number>(0);
  const [dScroll, setDScroll] = useState<number>(0);
  const [photo, setPhoto] = useState<any>(null);

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

  useEffect(() => {
    updatePosts();
  }, [props.posts.current, isDark]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    loadPosts(props).then(() => {
      setRefreshing(false);
    });
  }, []);

  const handleScroll = (event: any) => {
    const yOffset = event.nativeEvent.contentOffset.y;

    setDScroll(scrollPos - yOffset);
    setScrollPos(yOffset);
  }

  const updatePosts = () => {
    setPostsRender(<></>);

    if (!props.posts.current) {
      return;
    }

    if (props.posts.current) {
      const listPosts = posts.map((post, index) => {
        return (
          <View key={index} style={[styles.postContainer, { borderRadius: 10, backgroundColor: colors.postInnerContainerColor }]}>
            {(post.files && post.files.length > 0) &&
              <FullWidthImage source={{ uri: post.files[0] }} />
            }
            <View style={{ padding: 10 }}>
              <Text style={[styles.text, { fontWeight: 'bold', fontSize: 20, marginBottom: 5 }]}>{post.title}</Text>
              <Text style={[styles.text, { fontSize: 15 }]}>{post.body}</Text>
            </View>
          </View>
        );
      });

      setPostsRender(listPosts);
    }
  }

  const handleChoosePhoto = () => {
    const options: any = {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      const imagePickerResponse: any = response;
      if (imagePickerResponse) {
        setPhoto(imagePickerResponse.uri);

        // TODO: move this to when the submit button is clicked and show preview of image being uploaded
        // TODO: add guid to filename / storage ref to prevent conflict
        const reference = storage().ref(imagePickerResponse.fileName);
        reference.putFile(imagePickerResponse.uri).then(()=>{
          if(DEBUG_MODE) console.log('image uploaded');
        }).catch((error)=>{
          if(DEBUG_MODE) console.log('error uploading to firebase');
          console.error(error);
        });

        // TODO: firebase upload photo using uri above
        // TODO: firebase upload photo using uri above
        // TODO: firebase upload photo using uri above
        // TODO: firebase upload photo using uri above
        // TODO: firebase upload photo using uri above
        // TODO: firebase upload photo using uri above
        // TODO: firebase upload photo using uri above
        // TODO: firebase upload photo using uri above
        // TODO: firebase upload photo using uri above
        // TODO: firebase upload photo using uri above
        // TODO: firebase upload photo using uri above
        // TODO: firebase upload photo using uri above
        // TODO: firebase upload photo using uri above
        // TODO: firebase upload photo using uri above
        // TODO: firebase upload photo using uri above
        // TODO: firebase upload photo using uri above
        // TODO: firebase upload photo using uri above
        // TODO: firebase upload photo using uri above
        // TODO: firebase upload photo using uri above
        // TODO: firebase upload photo using uri above
        // TODO: firebase upload photo using uri above






      }
      else {
        console.error('error opening image picker');
      }
    })
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
              <View style={[styles.modalView, { width: '100%' }]}>
                <View style={[styles.inputContainer, { width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }]}>
                  <TextInput
                    placeholder={'Topic'}
                    value={postTitle}
                    onChange={event => setPostTitle(event.nativeEvent.text)}
                    style={[styles.input, { width: '100%', marginBottom: 20 }]}
                    placeholderTextColor="#474b52"
                  />
                  <TextInput
                    placeholder={'What\'s on your mind?'}
                    multiline={true}
                    numberOfLines={10}
                    value={postBody}
                    onChange={event => setPostBody(event.nativeEvent.text)}
                    style={[styles.input, { width: '100%', height: 100, marginBottom: 20 }]}
                    placeholderTextColor="#474b52"
                  />
                  <Button title="Choose Photo" onPress={handleChoosePhoto} />
                </View>
                <Pressable
                  style={[styles.button, styles.sendRequestBtn]}
                  onPress={() => {
                    setSendingPost(true);

                    const visibility = 'friends';
                    const files = [];
                    const type = 'normal';

                    createPost(props.userSession.current, props, visibility, postTitle, postBody, files, type).then(([data, error]) => {
                      if (error) {
                        if (DEBUG_MODE) console.error('CREATE POST ERROR', 'SERVER ERROR');
                        if (DEBUG_MODE) console.error(error);
                        setSendingPost(false);
                      }
                      else if (data) {
                        if (DEBUG_MODE) console.log('post sent!');

                        // get the post
                        loadPosts(props).then(() => {
                          // reset form
                          setSendingPost(false);
                          setPostModalVisible(false);
                          setPostTitle('');
                          setPostBody('');
                        });
                      }
                      else {
                        if (DEBUG_MODE) console.error('CREATE POST ERROR', 'APP ERROR');
                        setSendingPost(false);
                      }
                    });
                  }}
                >
                  {
                    sendingPost
                      ?
                      <ActivityIndicator size='small' color='white' />
                      :
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>Post</Text>
                  }
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
      {(userSession && vehicle && carImgData && posts)
        ?
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <FullWidthImage source={{ uri: carImgData }} />
          <Text style={[styles.text, { textAlign: 'center', fontWeight: 'bold', fontSize: 25, marginTop: 20, marginBottom: 15 }]}>{userSession.firstName}'s {vehicle.modelYear} {vehicleMake} {vehicle.modelName}</Text>

          {(posts.length > 0) &&
            <>
              {postsRender}
            </>
          }
        </ScrollView>
        :
        <View style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='large' color={colors.activityIndicator} />
        </View>
      }

      {(userSession && vehicle && carImgData) &&
        <FadeInOut visible={!postModalVisible && (scrollPos === 0)}>
          <Pressable onPress={() => { setPostModalVisible(true) }} style={[styles.postBtnContainer]}>
            <MaterialCommunityIcons style={{ elevation: 3 }} name='pen' color={colors.createPostGlyph} size={25} />
          </Pressable>
        </FadeInOut>
      }
    </SafeAreaView >
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedView);
