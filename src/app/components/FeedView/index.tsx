import React from 'react';
import FullWidthImage from 'react-native-fullwidth-image';

import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, SafeAreaView, View, ScrollView } from 'react-native';
import { getCarImageFull, getVehicles } from '../../api/api';
import { useTheme } from '../../styles/ThemeContext';
import { retrieveUserSession } from '../../utilities/userSession';
import { bindActionCreators } from 'redux';
import { setUserSession } from '../../redux/actions/UserSessionActions';
import { setVehicles } from '../../redux/actions/VehiclesActions';
import { connect } from 'react-redux';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const FeedView = (props: any) => {
  const { styles, colors } = useTheme();
  const [carImgData, setCarImgData] = useState<any>(undefined);

  useEffect(() => {
    const loadCarImage = async () => {
      const userSession = await retrieveUserSession();
      setUserSession(userSession);
      
      let vehicles = undefined;

      if (userSession) {
        await getVehicles(userSession, props).then(([data, error]) => {
          if (error) {
            console.error('GET VEHICLES ERROR', 'SERVER ERROR');
            console.error(error);
          }
          else if (data) {
            vehicles = data;
            props.setVehicles(data);
          }
          else {
            console.error('GET VEHICLES ERROR', 'APP ERROR');
          }
        });
      }

      const carImgData = await getCarImageFull(userSession, props, vehicles);
      setCarImgData(carImgData);
    };

    if (!carImgData) {
      loadCarImage();
    }
  }, []);

  const userSession = props.userSession.current;
  const vehiclesArray = props.vehicles.current;
  const vehicle = vehiclesArray && vehiclesArray.length > 0 ? vehiclesArray[0] : undefined;
  
  let vehicleMake = '';

  if(vehicle) {
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
          <Text style={[styles.text, {textAlign: 'center'}]}>Welcome {userSession.firstName}!</Text>
          <FullWidthImage source={{ uri: carImgData }} />
          <Text style={[styles.text, {textAlign: 'center'}]}>{vehicle.modelYear} {vehicleMake} {vehicle.modelName}</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(FeedView);
