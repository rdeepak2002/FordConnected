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
  const [markers, setMarkers] = useState<any>(undefined);

  useEffect(() => {
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
    updateMarkers();
  }, [props.vehicles.current, props.friends.current]);

  const updateMarkers = () => {
    setMarkers(<></>);

    if(!props.friends.current) {
      return;
    }

    const newMarkers = props.friends.current.map((friend, index) => {
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
        const carName = `${friendVehicle.modelYear} ${vehicleMake} ${friendVehicle.modelName}`;

        friendVehicle.fullCarName = carName;

        return (
          <Marker
            key={JSON.stringify(friend)}
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
            <View style={[styles.container, { padding: 10, borderRadius: 5, borderWidth: 0.5, borderColor: colors.borderColor }]}>
              <Text style={[styles.text, { fontSize: 18, fontWeight: 'bold' }]}>{friendName}</Text>
              <Text style={[styles.text, { fontSize: 12 }]}>{carName}</Text>
            </View>
          </Marker>
        );
      })
    });

    setMarkers(newMarkers);
  }

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
              <View style={[styles.modalView, { width: '80%', padding: 20 }]}>
                {
                  (friendSelected)
                    ?
                    <>
                      <Text style={[styles.text, { fontWeight: 'bold', fontSize: 18, marginBottom: 10 }]}>{friendSelected.firstName}'s {friendVehicleSelected.fullCarName}</Text>
                      {
                        friendVehicleSelected &&
                        <View style={[{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }]}>
                          <Text style={[styles.text, { marginBottom: 10 }]}>Speed: {friendVehicleSelected.vehicleLocationSpeed} mph {friendVehicleSelected.vehicleLocationDirection}</Text>
                          <Text style={[styles.text, { marginBottom: 10 }]}>Mileage: {friendVehicleSelected.mileage} miles</Text>
                          <Text style={[styles.text, { marginBottom: 10 }]}>Odometer: {friendVehicleSelected.odometer} miles</Text>
                          <Text style={[styles.text, { marginBottom: 10 }]}>Ignition Status: {friendVehicleSelected.ignitionStatusValue}</Text>
                          <Text style={[styles.text, { marginBottom: 0 }]}>Last active: {new Date(friendVehicleSelected.updatedAt).toString()}</Text>
                        </View>
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
            {markers}
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