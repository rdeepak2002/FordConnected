import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/Ionicons';

import { useEffect, useState } from 'react';
import { Text, Image, SafeAreaView, View, ActivityIndicator, Button, Pressable, Modal, RefreshControl, TouchableWithoutFeedback, TouchableOpacity, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addFriend, getFriends } from '../../api/api';
import { setUserSession } from '../../redux/actions/UserSessionActions';
import { setVehicles } from '../../redux/actions/VehiclesActions';
import { useTheme } from '../../styles/ThemeContext';
import { retrieveUserSession } from '../../utilities/userSession';

const SearchView = (props: any) => {
  const { styles, isDark, colors } = useTheme()
  const [friendsList, setFriendsList] = useState<any>(undefined);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [friendUsername, setFriendUsername] = useState<string>('');

  useEffect(() => {
    if (!friendsList) {
      loadFriends();
    }
  }, []);

  const loadFriends = async () => {
    const userSession = await retrieveUserSession();
    setUserSession(userSession);

    if (userSession) {
      await getFriends(userSession, props).then(([data, error]) => {
        if (error) {
          console.error('GET FRIENDS ERROR', 'SERVER ERROR');
          console.error(error);
        }
        else if (data) {
          const friendsListNotParsed: Array<any> = data;
          let friendsList: Array<any> = [];

          for (let i = 0; i < friendsListNotParsed.length; i++) {
            const person1 = friendsListNotParsed[i].pair[0];
            const person2 = friendsListNotParsed[i].pair[1];
            const friend = (person1.id === userSession.id) ? person2 : person1;
            friendsList.push(friend);
          }

          setFriendsList(friendsList);
        }
        else {
          console.error('GET FRIENDS ERROR', 'APP ERROR');
        }
      });
    }
  };

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
              source={require('../../assets/defaultProfile.jpg')}
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    loadFriends().then(() => {
      setRefreshing(false);
    });
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
          supportedOrientations={['portrait', 'landscape']}
        >
          <TouchableWithoutFeedback onPress={() => { setModalVisible(false) }}>
            <View style={[styles.centeredView]}>
              <View style={[styles.modalView, { width: '80%' }]}>
                <TextInput
                  placeholder={'username'}
                  value={friendUsername}
                  onChange={event => setFriendUsername(event.nativeEvent.text)}
                  style={styles.input}
                />
                <Pressable
                  style={[styles.button, styles.sendRequestBtn]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={{color: 'white'}}>Send Request</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
      {(friendsList)
        ?
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {friendsList.length > 0
              ?
              <Text style={[styles.text, { fontSize: 24, marginTop: 5, marginBottom: 5, marginLeft: 15, fontWeight: 'bold' }]}>{friendsList.length} {friendsList.length > 1 ? 'Friends' : 'Friend'}</Text>
              :
              <Text style={[styles.text, { fontSize: 24, marginTop: 5, marginBottom: 5, marginLeft: 15, fontWeight: 'bold' }]}>No Friends</Text>
            }
            <Pressable onPress={() => { setModalVisible(true) }} style={{ marginLeft: 'auto', marginRight: 15 }}>
              <MaterialCommunityIcons name='add-circle-outline' color={isDark ? 'white' : 'black'} size={40} />
            </Pressable>
          </View>
          {renderFriendsList()}
        </ScrollView>
        :
        <View style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='large' color={colors.activityIndicator} />
        </View>
      }
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  const { userSession, vehicles } = state
  return { userSession, vehicles }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setUserSession,
    setVehicles
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SearchView);
