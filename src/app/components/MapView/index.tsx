import React, { useState } from 'react';
import MapView from 'react-native-maps';

import { Text, SafeAreaView, View, ActivityIndicator } from 'react-native';
import { useTheme } from '../../styles/ThemeContext';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../HomeView';

const MapViewScreen = (props: any) => {
  const { styles, colors } = useTheme();
  const [latitudeDelta, setLatitudeDelta] = useState<number>(0.8);
  const [longitudeDelta, setLongitudeDelta] = useState<number>(0.8);

  const vehicles = props.vehicles.current;
  let vehicle;

  if (vehicles) {
    if (vehicles.length > 0) {
      vehicle = vehicles[0];
      console.log(vehicle);
    }
  }

  return (
    <>
      {(vehicle)
        ?
        <View style={styles.container}>
          <MapView
            style={{ flex: 1 }}
            region={{
              latitude: vehicle ? parseFloat(vehicle.vehicleLocationLatitude) : 0,
              longitude: vehicle ? parseFloat(vehicle.vehicleLocationLongitude) : 0,
              latitudeDelta: vehicle ? latitudeDelta : 100,
              longitudeDelta: vehicle ? longitudeDelta : 100
            }}
            showsUserLocation={true}
          />
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