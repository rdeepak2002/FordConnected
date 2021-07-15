import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

import { useState } from 'react';
import { Keyboard, Text, Image, SafeAreaView, View, ActivityIndicator, Button, Pressable, RefreshControl, TouchableWithoutFeedback, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { addFriend } from '../../api/api';
import { useTheme } from '../../styles/ThemeContext';
import { loadFriends, mapDispatchToProps, mapStateToProps } from '../HomeView';
import FadeInOut from 'react-native-fade-in-out';

const SearchView = (props: any) => {
  const { styles, isDark, colors } = useTheme()

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [friendUsername, setFriendUsername] = useState<string>('');
  const [makingFriendRequest, setMakingFriendRequest] = useState<boolean>(false);

  const friendsList = props.friends.current;
  const friendRequestedList = props.friends.requested;

  const makeAddFriendRequest = (username: string, showPopup?: boolean) => {
    addFriend(username, props.userSession.current, props).then(([response, error]) => {
      setMakingFriendRequest(false);

      if (response) {
        setModalVisible(false);
        setFriendUsername('');
        if(showPopup) {
          Alert.alert(
            'Friend Request Sent!',
            '',
            [
              { text: 'OK', onPress: (() => { setFriendUsername(''); }) },
            ],
            { cancelable: false },
          );
          loadFriends(props);
        }
      }
      else if (error) {
        Alert.alert(
          'User Not Found',
          'No user exists with this username',
          [
            { text: 'OK', onPress: (() => { setFriendUsername(''); }) },
          ],
          { cancelable: false },
        );
      }
      else {
        Alert.alert(
          'Error',
          'An error occurred while communicating with the server',
          [
            { text: 'OK', onPress: (() => { setFriendUsername(''); }) },
          ],
          { cancelable: false },
        );
      }
    });
  }

  const renderFriendsList = () => {
    if (friendsList) {
      const listItems = friendsList.map((friend) => {
        const vehicles = friend.vehicles;
        const vehicle = vehicles && vehicles.length > 0 ? vehicles[0] : undefined;
        const imageSideLength = 70;

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
          <View key={friend.id} style={{ marginLeft: 5, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Image
              source={{ uri: friend.profilePictureUrl }}
              style={{
                width: imageSideLength,
                height: imageSideLength,
                borderRadius: imageSideLength / 2,
                marginLeft: 10,
                borderWidth: 0.5,
                borderColor: 'grey'
              }}
            />
            <View style={{ height: imageSideLength, marginLeft: 20, marginTop: 10, marginBottom: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
              <Text style={[styles.text, { fontSize: 20 }]}>{friend.firstName} {friend.lastName}</Text>
              {vehicle &&
                <Text style={[styles.textSecondary, { fontSize: 15, marginTop: 2 }]}>{vehicle.modelYear} {vehicleMake} {vehicle.modelName}</Text>
              }
            </View>
          </View>
        );
      });

      return listItems;
    }
  }

  const renderFriendsRequestList = () => {
    if (friendRequestedList && props.userSession.current) {
      const listItems = friendRequestedList.map((friendRequest) => {
        const person1 = friendRequest.pair[0];
        const person2 = friendRequest.pair[1];
        const friend = (person1.id === props.userSession.current.id) ? person2 : person1;

        const vehicles = friend.vehicles;
        const vehicle = vehicles && vehicles.length > 0 ? vehicles[0] : undefined;
        const imageSideLength = 70;

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
          <View key={friend.id} style={{ marginLeft: 5, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Image
              source={{ uri: friend.profilePictureUrl }}
              style={{
                width: imageSideLength,
                height: imageSideLength,
                borderRadius: imageSideLength / 2,
                marginLeft: 10,
                borderWidth: 0.5,
                borderColor: 'grey'
              }}
            />
            <View style={{ height: imageSideLength, marginLeft: 20, marginTop: 10, marginBottom: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
              <Text style={[styles.text, { fontSize: 20 }]}>{friend.firstName} {friend.lastName}</Text>
              {vehicle &&
                <Text style={[styles.textSecondary, { fontSize: 15, marginTop: 2 }]}>{vehicle.modelYear} {vehicleMake} {vehicle.modelName}</Text>
              }
            </View>
            {friendRequest.requesterUserId === props.userSession.current.id
              ?
              <View style={{ marginLeft: 'auto', marginRight: 30 }}>
                <Text style={[styles.textSecondary, { fontSize: 15, marginTop: 2 }]}>Pending</Text>
              </View>
              :
              <View style={{ marginLeft: 'auto', marginRight: 30 }}>
                <Button
                  title='Accept'
                  onPress={() => {
                    makeAddFriendRequest(friend.username);
                  }}
                  color={isDark ? 'white' : '#1973e8'}
                />
              </View>
            }

          </View>
        );
      });

      return listItems;
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    loadFriends(props).then(() => {
      setRefreshing(false);
    });
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Modal
          isVisible={modalVisible}
          supportedOrientations={['portrait', 'landscape']}
          backdropOpacity={0.4}
        >
          <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
          }}>
            <View style={[styles.centeredView]}>
              <View style={[styles.modalView, { width: '80%' }]}>
                <View style={[styles.inputContainer, { width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }]}>
                  <TextInput
                    placeholder={'username'}
                    value={friendUsername}
                    onChange={event => setFriendUsername(event.nativeEvent.text)}
                    style={[styles.input, { width: '90%', marginBottom: 20 }]}
                    placeholderTextColor="#474b52"
                  />
                </View>
                <Pressable
                  style={[styles.button, styles.sendRequestBtn]}
                  onPress={() => {
                    setMakingFriendRequest(true);
                    makeAddFriendRequest(friendUsername, true);
                  }}
                >
                  {
                    makingFriendRequest
                      ?
                      <ActivityIndicator size='small' color='white' />
                      :
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>Send Request</Text>
                  }
                </Pressable>
                <View style={{ marginTop: 20 }}>
                  <Button title="Close" color={isDark ? 'white' : 'rgba(230, 50, 50, 1.0)'} onPress={() => {
                    if (!makingFriendRequest) {
                      setModalVisible(false);
                      setFriendUsername('');
                    }
                  }} />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
      {(friendsList && friendRequestedList)
        ?
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', height: 40 }}>
            {friendsList.length > 0
              ?
              <Text style={[styles.text, { fontSize: 24, marginTop: 5, marginBottom: 5, marginLeft: 15, fontWeight: 'bold' }]}>{friendsList.length} {friendsList.length > 1 ? 'Friends' : 'Friend'}</Text>
              :
              <Text style={[styles.text, { fontSize: 24, marginTop: 5, marginBottom: 5, marginLeft: 15, fontWeight: 'bold' }]}>No Friends</Text>
            }

            <FadeInOut visible={!modalVisible} style={{ marginLeft: 'auto', marginRight: 15 }}>
              <Pressable onPress={() => { setModalVisible(true) }}>
                <MaterialCommunityIcons name='add-circle-outline' color={isDark ? 'white' : 'black'} size={40} />
              </Pressable>
            </FadeInOut>
          </View>
          {renderFriendsList()}
          {friendRequestedList.length > 0 &&
            <>
              <Text style={[styles.text, { fontSize: 24, marginTop: 5, marginBottom: 5, marginLeft: 15, fontWeight: 'bold' }]}>Friend Requests</Text>
              {renderFriendsRequestList()}
            </>
          }
        </ScrollView>
        :
        <View style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='large' color={colors.activityIndicator} />
        </View>
      }
    </SafeAreaView >
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchView);
