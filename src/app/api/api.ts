import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import { DEBUG_MODE, REACT_APP_API_URL, REACT_APP_API_VERSION, REACT_APP_APPLICATION_ID, REACT_APP_CLIENT_ID, REACT_APP_CLIENT_SECRET } from '../../Constants';
import { storeUserSession } from '../utilities/userSession';
import { MMKV } from 'react-native-mmkv';

const loginUser = async (username: string, firstName: string, lastName: string, code: string): Promise<[response: any, error: any]> => {
  const postData: any = JSON.stringify({
    query: `mutation {
      loginUser(username: "${username}", firstName: "${firstName}", lastName: "${lastName}", code: "${code}"){
        userId
        fordProfileId
        accessToken
        accessExpiresAtSeconds
        refreshToken
        refreshExpiresAtSeconds
      }
    }`,
    variables: {}
  });

  let response = undefined;
  let error = undefined;

  const url = `${REACT_APP_API_URL}/api/graphql`;

  if (DEBUG_MODE) console.log('API CALL loginUser', url);

  try {
    const data = await axios.post(url, postData);
    if (data.data.data) {
      response = data.data.data.loginUser;
    }
    error = data.data.errors;
  }
  catch (err) {
    error = err;
  }

  return [response, error];
}

const refreshTokens = async (userSession: any, props: any): Promise<[response: any, error: any]> => {
  const postData: any = JSON.stringify({
    query: `mutation {
      refreshTokens(refreshToken: "${userSession.refreshToken}"){
        userId
        fordProfileId
        accessToken
        accessExpiresAtSeconds
        refreshToken
        refreshExpiresAtSeconds
      }
    }`,
    variables: {}
  });

  let response = undefined;
  let error = undefined;

  const url = `${REACT_APP_API_URL}/api/graphql`;

  if (DEBUG_MODE) console.log('API CALL refreshTokens', url);

  try {
    const data = await axios.post(url, postData);
    if (data.data.data) {
      response = data.data.data.refreshTokens;

      // let newUserSession: any = {};

      userSession.id = response.userId;
      // newUserSession.username = userSession.username;
      // newUserSession.firstName = userSession.firstName;
      // newUserSession.lastName = userSession.lastName;
      userSession.refreshToken = response.refreshToken;
      userSession.accessToken = response.accessToken;
      userSession.fordProfileId = response.fordProfileId;
      userSession.accessExpiresAtSeconds = parseInt(response.accessExpiresAtSeconds);
      userSession.refreshExpiresAtSeconds = parseInt(response.refreshExpiresAtSeconds);

      // userSession = newUserSession;

      props.setUserSession(userSession);

      await storeUserSession(userSession.id, userSession.username, userSession.firstName, userSession.lastName, userSession.refreshToken, userSession.accessToken, userSession.fordProfileId, userSession.accessExpiresAtSeconds, userSession.refreshExpiresAtSeconds);
    }
    error = data.data.errors;
  }
  catch (err) {
    error = err;
  }

  return [response, error];
}

const getCarImageFull = async (userSession: any, props: any, vehicles) => {
  const curTimestampSeconds = Math.floor(new Date().getTime() / 1000);

  if (!userSession || curTimestampSeconds >= userSession.accessExpiresAtSeconds) {
    if (DEBUG_MODE) console.log('API CALL getCarImageFull', 'refreshing tokens');
    await refreshTokens(props.userSession.current, props);
    return await getCarImageFull(props.userSession.current, props, vehicles);
  }
  else {
    if (DEBUG_MODE) console.log('API CALL getCarImageFull', 'getting image');

    const vehicle = vehicles[0];
    const vehicleId = vehicle?.id;
    const make = vehicle?.make;
    const modelName = vehicle?.modelName;
    const modelYear = vehicle?.modelYear;

    let data;

    await RNFetchBlob.fetch('GET', `https://api.mps.ford.com/api/fordconnect/vehicles/v1/${vehicleId}/images/full?make=${make}&model=${modelName}&year=${modelYear}`, {
      "Authorization": `Bearer ${userSession.accessToken}`,
      "api-version": REACT_APP_API_VERSION,
      "Application-Id": REACT_APP_APPLICATION_ID
    })
      .then((res) => {
        let status = res.info().status;

        if (status == 200) {
          let base64Str = res.base64()
          data = `data:image/png;base64,${base64Str}`;
        }
      });

    return data;
  }
}

const getVehicles = async (userSession: any, props: any): Promise<[response: any, error: any]> => {
  const curTimestampSeconds = Math.floor(new Date().getTime() / 1000);

  if (!userSession || curTimestampSeconds >= userSession.accessExpiresAtSeconds) {
    if (DEBUG_MODE) console.log('API CALL getUserVehicles', 'refreshing tokens');
    await refreshTokens(props.userSession.current, props);
    return await getVehicles(props.userSession.current, props);
  }
  else {
    const postData = JSON.stringify({
      query: `{
        getVehicles(accessToken: "${userSession.accessToken}"){
            id
            userId
            fordProfileId
            make
            modelName
            modelYear
            color
            nickname
            modemEnabled
            vehicleAuthorizationIndicator
            serviceCompatible
            lastUpdated
            engineType
            fuelLevelValue
            fuelLevelDistanceToEmpty
            mileage
            odometer
            remoteStartStatus
            chargingStatusValue
            ignitionStatusValue
            doorStatus
            vehicleLocationLongitude
            vehicleLocationLatitude
            vehicleLocationSpeed
            vehicleLocationDirection
            createdAt
            updatedAt
          }
      }`,
      variables: {}
    });

    let response = undefined;
    let error = undefined;

    const url = `${REACT_APP_API_URL}/api/graphql`;

    if (DEBUG_MODE) console.log('API CALL getVehicles', url);

    try {
      const data = await axios.post(url, postData);
      if (data.data.data) {
        response = data.data.data.getVehicles;
        MMKV.set('vehicles', JSON.stringify(response));
      }
      error = data.data.errors;
    }
    catch (err) {
      error = err;
    }

    return [response, error];
  }
}

const addFriend = async (usernameOfFriend: string, userSession: any, props: any): Promise<[response: any, error: any]> => {
  const curTimestampSeconds = Math.floor(new Date().getTime() / 1000);

  if (!userSession || curTimestampSeconds >= userSession.accessExpiresAtSeconds) {
    if (DEBUG_MODE) console.log('API CALL addFriend', 'refreshing tokens');
    await refreshTokens(props.userSession.current, props);
    return await getVehicles(props.userSession.current, props);
  }
  else {
    const postData = JSON.stringify({
      query: `mutation {
        addFriend(accessToken: "${userSession.accessToken}", username: "${usernameOfFriend}")
      }`,
      variables: {}
    });

    let response = undefined;
    let error = undefined;

    const url = `${REACT_APP_API_URL}/api/graphql`;

    if (DEBUG_MODE) console.log('API CALL addFriend', url);

    try {
      const data = await axios.post(url, postData);
      if (data.data.data) {
        response = data.data.data.addFriend;
      }
      error = data.data.errors;
    }
    catch (err) {
      error = err;
    }

    return [response, error];
  }
}

const getFriends = async (userSession: any, props: any): Promise<[response: any, error: any]> => {
  const curTimestampSeconds = Math.floor(new Date().getTime() / 1000);

  if (!userSession || curTimestampSeconds >= userSession.accessExpiresAtSeconds) {
    if (DEBUG_MODE) console.log('API CALL getFriends', 'refreshing tokens');
    await refreshTokens(props.userSession.current, props);
    return await getVehicles(props.userSession.current, props);
  }
  else {
    const postData = JSON.stringify({
      query: `{
        getFriends(accessToken: "${userSession.accessToken}"){
          id
          requesterUserId
          status
          pair {
              id
              username
              firstName
              lastName
              fordProfileId
              updatedAt
              createdAt
              lastActive
              vehicles {
                  id
                  userId
                  fordProfileId
                  make
                  modelName
                  modelYear
                  color
                  nickname
                  modemEnabled
                  vehicleAuthorizationIndicator
                  serviceCompatible
                  lastUpdated
                  engineType
                  fuelLevelValue
                  fuelLevelDistanceToEmpty
                  mileage
                  odometer
                  remoteStartStatus
                  chargingStatusValue
                  ignitionStatusValue
                  doorStatus
                  vehicleLocationLongitude
                  vehicleLocationLatitude
                  vehicleLocationSpeed
                  vehicleLocationDirection
                  createdAt
                  updatedAt
              }
          }
          updatedAt
          createdAt
        }
      }`,
      variables: {}
    });

    let response = undefined;
    let error = undefined;

    const url = `${REACT_APP_API_URL}/api/graphql`;

    if (DEBUG_MODE) console.log('API CALL getFriends', url);

    try {
      const data = await axios.post(url, postData);
      if (data.data.data) {
        response = data.data.data.getFriends;
      }
      error = data.data.errors;
    }
    catch (err) {
      error = err;
    }

    return [response, error];
  }
}

export { loginUser, refreshTokens, getCarImageFull, getVehicles, addFriend, getFriends }