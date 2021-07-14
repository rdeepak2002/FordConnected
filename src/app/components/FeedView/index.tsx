import React from 'react';
import FullWidthImage from 'react-native-fullwidth-image';
import MaterialCommunityIcons from 'react-native-vector-icons/FontAwesome5';
import Modal from 'react-native-modal';

import { useState, useEffect } from 'react';
import { ActivityIndicator, Text, SafeAreaView, View, ScrollView, TouchableWithoutFeedback, TextInput, Pressable, RefreshControl } from 'react-native';
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
          <View key={index} style={[styles.postContainer]}>
            <FullWidthImage source={{ uri: 'https://www.telegraph.co.uk/content/dam/Travel/2018/September/El-Yunque-morning-mist-iStock-535499464.jpg?imwidth=450' }} style={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }} />
            <View style={{ padding: 10, backgroundColor: colors.postInnerContainerColor, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
              <Text style={[styles.text, { fontWeight: 'bold', fontSize: 20, marginBottom: 5 }]}>{post.title}</Text>
              <Text style={[styles.text, { fontSize: 15 }]}>{post.body}</Text>
            </View>
          </View>
        );
      });

      setPostsRender(listPosts);
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
                </View>
                <Pressable
                  style={[styles.button, styles.sendRequestBtn]}
                  onPress={() => {
                    setSendingPost(true);

                    const visibility = 'normal';
                    const files = [];
                    const type = 'normal';

                    createPost(props.userSession.current, props, visibility, postTitle, postBody, files, type).then(([data, error]) => {
                      if (error) {
                        if (DEBUG_MODE) console.error('CREATE POST ERROR', 'SERVER ERROR');
                        if (DEBUG_MODE) console.error(error);
                      }
                      else if (data) {
                        if (DEBUG_MODE) console.log('post sent!');
                      }
                      else {
                        if (DEBUG_MODE) console.error('CREATE POST ERROR', 'APP ERROR');
                      }

                      // reset form
                      setSendingPost(false);
                      setPostModalVisible(false);
                      setPostTitle('');
                      setPostBody('');
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

      {(userSession && vehicle && carImgData && !postModalVisible && dScroll >= 0) &&
        <Pressable onPress={() => { setPostModalVisible(true) }} style={[styles.postBtnContainer]}>
          <MaterialCommunityIcons style={{ elevation: 3 }} name='pen' color={colors.createPostGlyph} size={25} />
        </Pressable>
      }
    </SafeAreaView >
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedView);
