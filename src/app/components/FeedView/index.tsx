import React from 'react';
import FullWidthImage from 'react-native-fullwidth-image';

import { useEffect, useState } from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import { getCarImageFull, getUserVehicles } from '../../api/api';
import { useTheme } from '../../styles/ThemeContext';
import { retrieveUserSession } from '../../utilities/userSession';
import { bindActionCreators } from 'redux';
import { setUserSession } from '../../redux/actions/UserSessionActions';
import { setVehicles } from '../../redux/actions/VehiclesActions';
import { connect } from 'react-redux';

const FeedView = (props: any) => {
  const { styles } = useTheme();
  const [carImgData, setCarImgData] = useState<any>(undefined);
  // const [vehicles, setVehicles] = useState<any>(undefined);

  useEffect(() => {
    const loadCarImage = async () => {
      const userSession = await retrieveUserSession();

      if (userSession) {
        await getUserVehicles(userSession, props).then(([data, error]) => {
          if (error) {
            console.error('GET VEHICLES ERROR', 'SERVER ERROR');
            console.error(error);
          }
          else if (data) {
            props.setVehicles(data);
          }
          else {
            console.error('GET VEHICLES ERROR', 'APP ERROR');
          }
        });
      }

      const carImgData = await getCarImageFull(userSession, props);
      setCarImgData(carImgData);
    };

    if (!carImgData) {
      loadCarImage();
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      {(carImgData) &&
        <View style={{ display: 'flex', flexDirection: 'column' }}>
          <FullWidthImage source={{ uri: carImgData }} />
          <Text style={styles.text}>{JSON.stringify(props.vehicles)}</Text>
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
