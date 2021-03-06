import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import { DEBUG_MODE, REACT_APP_API_URL, REACT_APP_API_VERSION, REACT_APP_APPLICATION_ID, REACT_APP_CLIENT_ID, REACT_APP_CLIENT_SECRET } from '../../Constants';
import { retrieveUserSession, storeUserSession } from '../utilities/userSession';

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
  const userSessionFromStorage = await retrieveUserSession();
  userSession = userSessionFromStorage;

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

      userSession.id = response.userId;
      userSession.refreshToken = response.refreshToken;
      userSession.accessToken = response.accessToken;
      userSession.fordProfileId = response.fordProfileId;
      userSession.accessExpiresAtSeconds = parseInt(response.accessExpiresAtSeconds);
      userSession.refreshExpiresAtSeconds = parseInt(response.refreshExpiresAtSeconds);

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
    userSession = await retrieveUserSession();
    await refreshTokens(userSession, props);
    userSession = await retrieveUserSession();
    return await getCarImageFull(userSession, props, vehicles);
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
    userSession = await retrieveUserSession();
    await refreshTokens(userSession, props);
    userSession = await retrieveUserSession();
    return await getVehicles(userSession, props);
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
        // MMKV.set('vehicles', JSON.stringify(response));
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
    userSession = await retrieveUserSession();
    await refreshTokens(userSession, props);
    userSession = await retrieveUserSession();
    return await addFriend(usernameOfFriend, userSession, props);
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

const deleteFriend = async (usernameOfFriend: string, userSession: any, props: any): Promise<[response: any, error: any]> => {
  const curTimestampSeconds = Math.floor(new Date().getTime() / 1000);

  if (!userSession || curTimestampSeconds >= userSession.accessExpiresAtSeconds) {
    if (DEBUG_MODE) console.log('API CALL deleteFriend', 'refreshing tokens');
    userSession = await retrieveUserSession();
    await refreshTokens(userSession, props);
    userSession = await retrieveUserSession();
    return await deleteFriend(usernameOfFriend, userSession, props);
  }
  else {
    const postData = JSON.stringify({
      query: `mutation {
        deleteFriend(accessToken: "${userSession.accessToken}", username: "${usernameOfFriend}")
      }`,
      variables: {}
    });

    let response = undefined;
    let error = undefined;

    const url = `${REACT_APP_API_URL}/api/graphql`;

    if (DEBUG_MODE) console.log('API CALL deleteFriend', url);

    try {
      const data = await axios.post(url, postData);
      if (data.data.data) {
        response = data.data.data.deleteFriend;
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
    userSession = await retrieveUserSession();
    await refreshTokens(userSession, props);
    userSession = await retrieveUserSession();
    return await getFriends(userSession, props);
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
              profilePictureUrl
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

const updateUserVehicles = async (userSession: any, props: any): Promise<[response: any, error: any]> => {
  const curTimestampSeconds = Math.floor(new Date().getTime() / 1000);

  if (!userSession || curTimestampSeconds >= userSession.accessExpiresAtSeconds) {
    if (DEBUG_MODE) console.log('API CALL updateUserVehicles', 'refreshing tokens');
    userSession = await retrieveUserSession();
    await refreshTokens(userSession, props);
    userSession = await retrieveUserSession();
    return await updateUserVehicles(userSession, props);
  }
  else {
    const postData = JSON.stringify({
      query: `mutation {
        updateUserVehicles(accessToken: "${userSession.accessToken}"){
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

    if (DEBUG_MODE) console.log('API CALL updateUserVehicles', url);

    try {
      const data = await axios.post(url, postData);
      if (data.data.data) {
        response = data.data.data.updateUserVehicles;
      }
      error = data.data.errors;
    }
    catch (err) {
      error = err;
    }

    return [response, error];
  }
}

const createPost = async (userSession: any, props: any, visibility: string, title: string, body: string, files: string[], type: string): Promise<[response: any, error: any]> => {
  const curTimestampSeconds = Math.floor(new Date().getTime() / 1000);

  if (!userSession || curTimestampSeconds >= userSession.accessExpiresAtSeconds) {
    if (DEBUG_MODE) console.log('API CALL createPost', 'refreshing tokens');
    userSession = await retrieveUserSession();
    await refreshTokens(userSession, props);
    userSession = await retrieveUserSession();
    return await createPost(userSession, props, visibility, title, body, files, type);
  }
  else {
    const postData = JSON.stringify({
      query: `mutation {
        createPost(accessToken: "${userSession.accessToken}", visibility: "${visibility}", title: "${title}", body: "${body}", files: [${files.join()}], type: "${type}"){
          id
          userId
          fordProfileId
          visibility
          title
          body
          files
          updatedAt
          createdAt
          type
          user {
            id
            username
            firstName
            lastName
            fordProfileId
            updatedAt
            createdAt
            lastActive
            profilePictureUrl
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
        }
      }`,
      variables: {}
    });


    let response = undefined;
    let error = undefined;

    const url = `${REACT_APP_API_URL}/api/graphql`;

    if (DEBUG_MODE) console.log('API CALL createPost', url);

    try {
      const data = await axios.post(url, postData);
      if (data.data.data) {
        response = data.data.data.createPost;
      }
      error = data.data.errors;
    }
    catch (err) {
      error = err;
    }

    return [response, error];
  }
}

const getPosts = async (userSession: any, props: any): Promise<[response: any, error: any]> => {
  const curTimestampSeconds = Math.floor(new Date().getTime() / 1000);

  if (!userSession || curTimestampSeconds >= userSession.accessExpiresAtSeconds) {
    if (DEBUG_MODE) console.log('API CALL getPosts', 'refreshing tokens');
    userSession = await retrieveUserSession();
    await refreshTokens(userSession, props);
    userSession = await retrieveUserSession();
    return await getPosts(userSession, props);
  }
  else {
    const postData = JSON.stringify({
      query: `query {
        getPosts(accessToken: "${userSession.accessToken}"){
          id
          userId
          fordProfileId
          visibility
          title
          body
          files
          updatedAt
          createdAt
          type
          user {
            id
            username
            firstName
            lastName
            fordProfileId
            updatedAt
            createdAt
            lastActive
            profilePictureUrl
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
        }
      }`,
      variables: {}
    });

    let response = undefined;
    let error = undefined;

    const url = `${REACT_APP_API_URL}/api/graphql`;

    if (DEBUG_MODE) console.log('API CALL getPosts', url);

    try {
      const data = await axios.post(url, postData);
      if (data.data.data) {
        response = data.data.data.getPosts;
      }
      error = data.data.errors;
    }
    catch (err) {
      error = err;
    }

    return [response, error];
  }
}

const deletePost = async (postId: string, userSession: any, props: any): Promise<[response: any, error: any]> => {
  const curTimestampSeconds = Math.floor(new Date().getTime() / 1000);

  if (!userSession || curTimestampSeconds >= userSession.accessExpiresAtSeconds) {
    if (DEBUG_MODE) console.log('API CALL deletePost', 'refreshing tokens');
    userSession = await retrieveUserSession();
    await refreshTokens(userSession, props);
    userSession = await retrieveUserSession();
    return await deletePost(postId, userSession, props);
  }
  else {
    const postData = JSON.stringify({
      query: `mutation {
        deletePost(accessToken: "${userSession.accessToken}", postId: "${postId}"){
          id
          userId
          fordProfileId
          visibility
          title
          body
          files
          updatedAt
          createdAt
          type
          user {
            id
            username
            firstName
            lastName
            fordProfileId
            updatedAt
            createdAt
            lastActive
            profilePictureUrl
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
        }
      }`,
      variables: {}
    });

    let response = undefined;
    let error = undefined;

    const url = `${REACT_APP_API_URL}/api/graphql`;

    if (DEBUG_MODE) console.log('API CALL deletePost', url);

    try {
      const data = await axios.post(url, postData);
      if (data.data.data) {
        response = data.data.data.deletePost;
      }
      error = data.data.errors;
    }
    catch (err) {
      error = err;
    }

    return [response, error];
  }
}

const setProfilePhoto = async (reference: any, userSession: any, props: any): Promise<[response: any, error: any]> => {
  const curTimestampSeconds = Math.floor(new Date().getTime() / 1000);

  if(!reference) {
    return [undefined, undefined];
  }

  const downloadUrl = await reference.getDownloadURL();

  if(!downloadUrl) {
    return [undefined, undefined];
  }

  if (!userSession || curTimestampSeconds >= userSession.accessExpiresAtSeconds) {
    if (DEBUG_MODE) console.log('API CALL setProfilePhoto', 'refreshing tokens');
    userSession = await retrieveUserSession();
    await refreshTokens(userSession, props);
    userSession = await retrieveUserSession();
    return await setProfilePhoto(reference, userSession, props);
  }
  else {
    const postData: any = JSON.stringify({
      query: `mutation {
        setProfilePhoto(accessToken: "${userSession.accessToken}", imageUri: "${downloadUrl}"){
          id
          profilePictureUrl
        }
      }`,
      variables: {}
    });

    let response = undefined;
    let error = undefined;

    const url = `${REACT_APP_API_URL}/api/graphql`;

    if (DEBUG_MODE) console.log('API CALL setProfilePhoto', url);

    try {
      const data = await axios.post(url, postData);
      if (data.data.data) {
        response = data.data.data.deletePost;
      }
      error = data.data.errors;
    }
    catch (err) {
      error = err;
    }

    return [response, error];
  }
}

const getUser = async (userSession: any, props: any): Promise<[response: any, error: any]> => {
  const curTimestampSeconds = Math.floor(new Date().getTime() / 1000);

  if (!userSession || curTimestampSeconds >= userSession.accessExpiresAtSeconds) {
    if (DEBUG_MODE) console.log('API CALL getUser', 'refreshing tokens');
    userSession = await retrieveUserSession();
    await refreshTokens(userSession, props);
    userSession = await retrieveUserSession();
    return await getUser(userSession, props);
  }
  else {
    const postData: any = JSON.stringify({
      query: `query {
        getUser(accessToken: "${userSession.accessToken}"){
          id
          profilePictureUrl
        }
      }`,
      variables: {}
    });

    let response = undefined;
    let error = undefined;

    const url = `${REACT_APP_API_URL}/api/graphql`;

    if (DEBUG_MODE) console.log('API CALL getUser', url);

    try {
      const data = await axios.post(url, postData);
      if (data.data.data) {
        response = data.data.data.getUser;
      }
      error = data.data.errors;
    }
    catch (err) {
      error = err;
    }

    return [response, error];
  }
}

export { loginUser, refreshTokens, getCarImageFull, getVehicles, addFriend, deleteFriend, getFriends, updateUserVehicles, createPost, getPosts, deletePost, setProfilePhoto, getUser }