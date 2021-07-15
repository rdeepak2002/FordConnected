import React from 'react';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'react-native-image-picker';

import { useState, useEffect } from 'react';
import { Text, SafeAreaView, View, Pressable, Image, Button, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../../App';
import { useTheme } from '../../styles/ThemeContext';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../HomeView';
import { firebase } from '@react-native-firebase/auth';
import { DEBUG_MODE } from '../../../Constants';
import { getUser, setProfilePhoto } from '../../api/api';

const SettingsView = (props: any) => {
  const { styles, isDark, colors } = useTheme();
  const { signOut } = React.useContext(AuthContext);
  const userSession = props.userSession.current;

  const [photo, setPhoto] = useState<any>({ uri: 'https://firebasestorage.googleapis.com/v0/b/ford-connected.appspot.com/o/blank-profile.png?alt=media&token=46bcf065-df1f-40f2-94c6-a33c58f39556' });
  const [initRetrievePhoto, setInitRetrievePhoto] = useState<boolean>(true);
  const [loadingProfilePicture, setLoadingProfilePicture] = useState<boolean>(false);

  useEffect(() => {
    if (initRetrievePhoto) {
      setLoadingProfilePicture(true);

      setInitRetrievePhoto(false);
      getUser(userSession, props).then(([data, error]) => {
        setLoadingProfilePicture(false);

        if (data) {
          const newPhoto = {
            uri: data.profilePictureUrl
          }
          props.setUserProfilePicture(data.profilePictureUrl);
          setPhoto(newPhoto);
        }
        else if (error) {
          console.error('GET PROFILE PICTURE SERVER ERROR');
          console.error(error);
        }
        else {
          console.error('GET PROFILE PICTURE APP ERROR');
        }
      });
    }
    const profilePicNew = {
      uri: props.userSession.profilePicture
    };
    setPhoto(profilePicNew);
    firebase.auth().signInAnonymously();
  }, [props.userSession.profilePicture]);

  const handleChoosePhoto = () => {
    const options: any = {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      const imagePickerResponse: any = response;
      if (imagePickerResponse && imagePickerResponse.assets && imagePickerResponse.assets.length > 0) {
        setLoadingProfilePicture(true);

        const asset = imagePickerResponse.assets[0];
        const reference = storage().ref(asset.fileName + uuid.v4().toString());
        reference.putFile(asset.uri).then((res) => {
          if (DEBUG_MODE) console.log('post image uploaded');

          setProfilePhoto(reference, userSession, props).then(() => {
            setLoadingProfilePicture(false);
            setPhoto(asset);
          });
        }).catch((error) => {
          if (DEBUG_MODE) console.log('error uploading post image to firebase');
          console.error(error);
        });
      }
      else {
        console.error('error opening image picker');
      }
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: '100%', paddingLeft: 30, paddingRight: 30 }}>
        <View>
          <Text style={[styles.text, { textAlign: 'center', fontWeight: 'bold', fontSize: 28, marginTop: 10, marginBottom: 20 }]}>Preferences</Text>

          {
            userSession &&
            <>
              {(photo && photo.uri) &&
                <View style={{ marginBottom: 20, display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  {
                    loadingProfilePicture
                      ?
                      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 100, height: 100, borderRadius: 50, borderColor: 'black', borderWidth: 0.1, marginBottom: 20 }}>
                        <ActivityIndicator size='small' color={colors.activityIndicator} />
                      </View>
                      :
                      <Image style={{ width: 100, height: 100, borderRadius: 50, borderColor: 'black', borderWidth: 0.1, marginBottom: 20 }} source={{ uri: photo.uri }} />
                  }
                  <Button title='Change Photo' color={isDark ? 'white' : '#1973e8'} onPress={() => { handleChoosePhoto(); }} />
                </View>
              }

              <Text style={[styles.text, { marginBottom: 20, fontSize: 18 }]}>Name: {userSession.firstName} {userSession.lastName}</Text>
              <Text style={[styles.text, { marginBottom: 20, fontSize: 18 }]}>Username: {userSession.username}</Text>
              {
                // DEBUG_MODE &&
                // <>
                //   <Text style={styles.text}>User ID: {userSession.id}</Text>
                //   <Text style={styles.text}>Ford Profile ID: {userSession.fordProfileId}</Text>
                //   <Text style={styles.text}>Access Token Expiry: {new Date(userSession.accessExpiresAtSeconds * 1000).toString()}</Text>
                //   <Text style={styles.text}>Refresh Token Expiry: {new Date(userSession.refreshExpiresAtSeconds * 1000).toString()}</Text>
                // </>
              }
            </>
          }

          <Text style={[styles.text, { marginBottom: 20, fontSize: 18 }]}>Theme: {isDark ? 'Dark' : 'Light'}</Text>

          {/* <ThemeToggle /> */}
        </View>

        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 'auto', marginBottom: '10%' }}>
          <Pressable
            style={[styles.button, { backgroundColor: '#f25b50', width: '50%' }]}
            onPress={() => {
              signOut();
            }}
          >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Log Out</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView);
