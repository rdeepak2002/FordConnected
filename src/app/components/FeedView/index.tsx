import React from 'react';
import FullWidthImage from 'react-native-fullwidth-image';

import { useEffect, useState } from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import { getCarImageFull } from '../../api/api';
import { useTheme } from '../../styles/ThemeContext';
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
      {carImgData &&
        <View style={{ display: 'flex', flexDirection: 'column' }}>
          <FullWidthImage source={{ uri: carImgData }} />
          <Text style={styles.text}>Feed</Text>
        </View>
      }
    </SafeAreaView>
  );
};

export default FeedView;
