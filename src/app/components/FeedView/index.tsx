import React, { useEffect, useState } from 'react';

import { Text, SafeAreaView, View, Image } from 'react-native';
import FullWidthImage from 'react-native-fullwidth-image';
import { getCarImageFull } from '../../api/api';
import { useTheme } from '../../styles/ThemeContext';
import Base64 from '../../utilities/Base64';
import { retrieveUserSession } from '../../utilities/userSession';

const FeedView = (props: any) => {
  const { styles } = useTheme();
  const [carImgData, setCarImgData] = useState<any>(undefined);

  useEffect(() => {
    const loadCarImage = async () => {
      const userSession = await retrieveUserSession();

      if (userSession) {
        setCarImgData(await getCarImageFull(userSession, props));
      }
    };

    if (!carImgData) {
      loadCarImage();
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={{display: 'flex', flexDirection: 'column'}}>
        {carImgData && <FullWidthImage source={{uri: carImgData}}/>}
        <Text style={styles.text}>Feed</Text>
      </View>
    </SafeAreaView>
  );
};

export default FeedView;
