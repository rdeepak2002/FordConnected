import React from 'react';
import FullWidthImage from 'react-native-fullwidth-image';
import MaterialCommunityIcons from 'react-native-vector-icons/FontAwesome5';
import Modal from 'react-native-modal';
import FadeInOut from 'react-native-fade-in-out';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'react-native-image-picker';

import { useState, useEffect } from 'react';
import { Keyboard, ActivityIndicator, Text, SafeAreaView, View, ScrollView, TouchableWithoutFeedback, TextInput, Pressable, RefreshControl, Button, Image, Alert } from 'react-native';
import { useTheme } from '../../styles/ThemeContext';
import { connect } from 'react-redux';
import { loadPosts, mapDispatchToProps, mapStateToProps } from '../HomeView';
import { createPost, deletePost, getPosts } from '../../api/api';
import { DEBUG_MODE } from '../../../Constants';
import { firebase } from '@react-native-firebase/auth';

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
  const [postVisibility, setPostVisibility] = useState<string>('friends');
  const [sendingPost, setSendingPost] = useState<boolean>(false);
  const [postsRender, setPostsRender] = useState<any>(undefined);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [scrollPos, setScrollPos] = useState<number>(0);
  const [dScroll, setDScroll] = useState<number>(0);
  const [photo, setPhoto] = useState<any>(null);
  const [deletingPost, setDeletingPost] = useState<boolean>(false);
  const [initLoadPosts, setInitLoadPosts] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Visible to friends', value: 'friends' },
    { label: 'Visible to everyone', value: 'public' }
  ]);

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
    if (initLoadPosts) {
      loadPosts(props);
      setInitLoadPosts(false);
    }

    updatePosts();
    firebase.auth().signInAnonymously();
  }, [props.posts.current, props.userSession.current, isDark]);

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

    if (props.userSession.current && props.posts.current) {
      const listPosts = posts.map((post, index) => {
        const postDate = new Date(post.updatedAt);
        postDate.setUTCHours(postDate.getHours());

        return (
          <TouchableWithoutFeedback key={post.id} onLongPress={() => {
            if (post && props.userSession.current && post.userId === props.userSession.current.id) {
              Alert.alert(
                'Delete Post?',
                '',
                [
                  {
                    text: 'Ok', onPress: (() => {
                      setDeletingPost(true);

                      deletePost(post.id, props.userSession.current, props).then(() => {
                        loadPosts(props).then(() => {
                          setDeletingPost(false);
                        }).catch(() => {
                          setDeletingPost(false);
                        });
                      }).catch(() => {
                        setDeletingPost(false);
                      });
                    })
                  },
                  { text: 'Cancel', onPress: (() => { }) },
                ],
                { cancelable: false },
              );
            }
          }}>
            <View style={[styles.postContainer, { borderRadius: 10, backgroundColor: colors.postInnerContainerColor }]}>
              <View style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, borderColor: isDark ? 'rgba(150,150,150,1.0)' : 'rgba(240,240,240,1.0)', borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Image style={{ marginLeft: 10, width: 35, height: 35, borderRadius: 18, borderColor: 'black', borderWidth: 0.1 }} source={{ uri: post.user.profilePictureUrl }} />
                <Text style={[styles.text, { fontWeight: 'bold', fontSize: 25, padding: 10 }]}>
                  {post.user.id === props.userSession.current.id ? 'Me' : `${post.user.firstName} ${post.user.lastName}`}
                </Text>
              </View>
              {(post.files && post.files.length > 0) &&
                <FullWidthImage source={{ uri: post.files[0] }} style={{}} />
              }
              <View style={{ padding: 10 }}>
                <Text style={[styles.text, { fontWeight: 'bold', fontSize: 20, marginBottom: 5 }]}>{post.title}</Text>
                <Text style={[styles.text, { fontSize: 15 }]}>{post.body}</Text>
              </View>
              <View style={{ borderTopLeftRadius: 10, marginTop: 10, borderTopRightRadius: 10, borderColor: isDark ? 'rgba(150,150,150,1.0)' : 'rgba(240,240,240,1.0)', borderTopWidth: 1, flexDirection: 'row-reverse', alignItems: 'center' }}>
                <Text style={[styles.text, { fontSize: 15, padding: 10 }]}>
                  {postDate.toLocaleString("en-US")}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
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
      if (imagePickerResponse && imagePickerResponse.assets && imagePickerResponse.assets.length > 0) {
        const asset = imagePickerResponse.assets[0];
        setPhoto(asset);
      }
      else {
        console.error('error opening image picker');
      }
    })
  }

  const handlePostBtn = () => {
    if (sendingPost || postTitle.length === 0 || postBody.length === 0) {
      return;
    }

    setSendingPost(true);

    const files = [];
    const type = 'normal';

    const submit = async (reference) => {
      if (reference) {
        const downloadUrl = await reference.getDownloadURL();
        console.log('download url', downloadUrl);
        files.push(`"${downloadUrl}"`);
      }
      createPost(props.userSession.current, props, postVisibility, postTitle.replace(/"/g, '\\"'), `""${postBody.replace(/"/g, '\\"')}""`, files, type).then(([data, error]) => {
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
            setPostVisibility('friends');
            setPhoto(null);
            setOpen(false);
          });
        }
        else {
          if (DEBUG_MODE) console.error('CREATE POST ERROR', 'APP ERROR');
          setSendingPost(false);
        }
      });
    }

    if (photo && photo.uri) {
      const reference = storage().ref(photo.fileName + uuid.v4().toString());
      reference.putFile(photo.uri).then((res) => {
        if (DEBUG_MODE) console.log('post image uploaded');
        submit(reference);
      }).catch((error) => {
        if (DEBUG_MODE) console.log('error uploading post image to firebase');
        console.error(error);
      });
    }
    else {
      submit(undefined);
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
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <View style={[styles.centeredView]}>
              <View style={[styles.modalView, { width: '100%' }]}>
                <View style={{ width: '100%' }}>
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
                      onChange={event => setPostBody(`${event.nativeEvent.text}`)}
                      style={[styles.input, { width: '100%', height: 100, marginBottom: 20 }]}
                      placeholderTextColor="#474b52"
                    />
                  </View>
                  <View style={{height: open ? 150 : 80}}>
                    <DropDownPicker
                      open={open}
                      value={postVisibility}
                      items={items}
                      setOpen={setOpen}
                      setValue={(value) => {
                        setPostVisibility(value)
                      }}
                      setItems={setItems}
                    />
                  </View>
                  <View style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                    {(photo && photo.uri) &&
                      <Image
                        source={{
                          uri: photo.uri,
                        }}
                        style={{ width: 100, height: 100 }}
                      />
                    }
                    <Button title={(photo && photo.uri) ? 'Remove Photo' : 'Add Photo'} color={isDark ? 'white' : '#1973e8'} onPress={() => {
                      if (photo && photo.uri) {
                        setPhoto(null);
                      }
                      else {
                        handleChoosePhoto();
                      }
                    }} />
                  </View>
                  <Pressable
                    style={[styles.button, styles.sendRequestBtn]}
                    onPress={handlePostBtn}
                  >
                    {
                      sendingPost
                        ?
                        <ActivityIndicator size='small' color='white' />
                        :
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Post</Text>
                    }
                  </Pressable>
                  <View style={{ marginTop: 20 }}>
                    <Button title='Close' color={isDark ? 'white' : 'rgba(230, 50, 50, 1.0)'} onPress={() => {
                      if (!sendingPost) {
                        setPostModalVisible(false);
                        setPhoto(null);
                        setPostTitle('');
                        setPostBody('');
                        setPostVisibility('friends');
                        setOpen(false);
                      }
                    }} />
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
      {(userSession && vehicle && carImgData && posts && !deletingPost)
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
          scrollEventThrottle={1}
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
        <FadeInOut visible={!postModalVisible && (scrollPos <= 10)}>
          <Pressable onPress={() => { setPostModalVisible(true) }} style={[styles.postBtnContainer]}>
            <MaterialCommunityIcons style={{ elevation: 3 }} name='pen' color={colors.createPostGlyph} size={25} />
          </Pressable>
        </FadeInOut>
      }
    </SafeAreaView >
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedView);
