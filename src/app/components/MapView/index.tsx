import React, { useState } from 'react';
import MapView from 'react-native-maps';
import Modal from 'react-native-modal';

import { Text, SafeAreaView, View, ActivityIndicator, TouchableWithoutFeedback, Pressable, TouchableHighlight } from 'react-native';
import { useTheme } from '../../styles/ThemeContext';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../HomeView';
import { Marker, Callout } from 'react-native-maps';
import { useEffect } from 'react';

const MapViewScreen = (props: any) => {
  const { styles, colors } = useTheme();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [latitudeDelta, setLatitudeDelta] = useState<number>(0.8);
  const [longitudeDelta, setLongitudeDelta] = useState<number>(0.8);
  const [region, setRegion] = useState<any>(undefined);
  const [vehicle, setVehicle] = useState<any>(undefined);
  const [friends, setFriends] = useState<any>(undefined);
  const [friendSelected, setFriendSelected] = useState<any>(undefined);
  const [friendVehicleSelected, setFriendVehicleSelected] = useState<any>(undefined);

  useEffect(() => {
    if (!region) {
      let vehicles = props.vehicles.current;
      let friends = props.friends.current;

      if (vehicles && !region) {
        let userVehicle;

        if (vehicles.length > 0) {
          userVehicle = vehicles[0];
          setVehicle(userVehicle);
        }

        setRegion({
          latitude: userVehicle ? parseFloat(userVehicle.vehicleLocationLatitude) : 0,
          longitude: userVehicle ? parseFloat(userVehicle.vehicleLocationLongitude) : 0,
          latitudeDelta: userVehicle ? latitudeDelta : 100,
          longitudeDelta: userVehicle ? longitudeDelta : 100
        });
      }

      setFriends(friends);
    }
  }, [props.vehicles.current, props.friends.current]);

  return (
    <>
      <View>
        <Modal
          isVisible={modalVisible}
          supportedOrientations={['portrait', 'landscape']}
          backdropOpacity={0.4}
        >
          <TouchableWithoutFeedback onPress={() => { setModalVisible(false) }}>
            <View style={[styles.centeredView]}>
              <View style={[styles.modalView, { width: '80%' }]}>
                {
                  (friendSelected)
                    ?
                    <>
                      <Text style={styles.text}>{friendSelected.firstName} {friendSelected.lastName}</Text>
                      {
                        friendVehicleSelected &&
                        <>
                          <Text style={styles.text}>{friendVehicleSelected.fullCarName}</Text>
                          <Text style={styles.text}>TODO: show mileage and other car stuff</Text>
                        </>
                      }
                    </>
                    :
                    <Text style={styles.text}>No Friend Selected</Text>
                }
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
      {(region && vehicle && friends)
        ?
        <View style={styles.container}>
          <MapView
            style={{ flex: 1 }}
            region={region}
            showsUserLocation={true}
          >
            {friends.map((friend, index) => {
              const friendVehicles = friend.vehicles;
              return friendVehicles.map((friendVehicle, index) => {
                let vehicleMake = '';

                if (friendVehicle) {
                  switch (friendVehicle.make) {
                    case 'F':
                      vehicleMake = 'Ford';
                      break;
                    case 'L':
                      vehicleMake = 'Lincoln';
                      break;
                  }
                }

                const friendName = `${friend.firstName} ${friend.lastName}`;
                const carName = `${vehicle.modelYear} ${vehicleMake} ${vehicle.modelName}`;

                friendVehicle.fullCarName = carName;

                return (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: parseFloat(friendVehicle.vehicleLocationLatitude),
                      longitude: parseFloat(friendVehicle.vehicleLocationLongitude)
                    }}
                    onCalloutPress={() => {
                      setFriendSelected(friend);
                      setFriendVehicleSelected(friendVehicle);
                      setModalVisible(true);
                    }}
                    title='click here for more info'
                  >
                    <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 5 }}>
                      <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>{friendName}</Text>
                      <Text style={{ color: 'black', fontSize: 12 }}>{carName}</Text>
                    </View>
                  </Marker>
                );
              })
            })}
            {/* <Marker
              key={0}
              coordinate={{
                latitude: 37.298984,
                longitude: -122.050362
              }}
              title={'title'}
              description={'desc'}
            /> */}
          </MapView>
        </View>
        :
        <SafeAreaView style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='large' color={colors.activityIndicator} />
        </SafeAreaView>
      }
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MapViewScreen);