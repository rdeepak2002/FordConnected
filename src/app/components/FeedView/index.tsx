import React from 'react';
import FullWidthImage from 'react-native-fullwidth-image';

import { ActivityIndicator, Text, SafeAreaView, View, ScrollView } from 'react-native';
import { useTheme } from '../../styles/ThemeContext';
import { bindActionCreators } from 'redux';
import { setUserSession } from '../../redux/actions/UserSessionActions';
import { setVehicles, setCarImage } from '../../redux/actions/VehiclesActions';
import { setFriends } from '../../redux/actions/FriendsActions';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../HomeView';

const FeedView = (props: any) => {
  const { styles, colors } = useTheme();

  const userSession = props.userSession.current;
  const vehicles = props.vehicles.current;
  const carImgData = props.vehicles.carImage;
  const vehicle = vehicles && vehicles.length > 0 ? vehicles[0] : undefined;

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
      {(userSession && vehicle && carImgData)
        ?
        <ScrollView style={{ display: 'flex', flexDirection: 'column' }}>
          <Text style={[styles.text, { textAlign: 'center' }]}>{userSession.firstName}'s {vehicle.modelYear} {vehicleMake} {vehicle.modelName}</Text>
          <FullWidthImage source={{ uri: carImgData }} />
          <Text style={styles.text}>feed</Text>
        </ScrollView>
        :
        <View style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='large' color={colors.activityIndicator} />
        </View>
      }
    </SafeAreaView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedView);
