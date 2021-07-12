import React, { useEffect, useState } from 'react';

import { Text, Image, SafeAreaView, View, ActivityIndicator, Button, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFriends } from '../../api/api';
import { setUserSession } from '../../redux/actions/UserSessionActions';
import { setVehicles } from '../../redux/actions/VehiclesActions';
import { useTheme } from '../../styles/ThemeContext';
import { retrieveUserSession } from '../../utilities/userSession';

const SearchView = (props: any) => {
  const { styles } = useTheme()
  const [friendsList, setFriendsList] = useState<any>(undefined);

  useEffect(() => {
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

    if (!friendsList) {
      loadFriends();
    }
  }, []);

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

  return (
    <SafeAreaView style={styles.container}>
      {(friendsList)
        ?
        <ScrollView>
          <View style={{ flexDirection: 'row' }}>

          </View>
          <Text style={[styles.text, {fontSize: 24, marginTop: 5, marginBottom: 5, marginLeft: 15, fontWeight: 'bold'}]}>{friendsList.length} {friendsList.length > 1 ? 'Friends' : 'Friend'}</Text>
          {renderFriendsList()}
        </ScrollView>
        :
        <View style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='large' />
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
