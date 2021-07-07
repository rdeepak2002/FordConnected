import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import { DEBUG_MODE, REACT_APP_API_URL, REACT_APP_API_VERSION, REACT_APP_APPLICATION_ID, REACT_APP_CLIENT_ID, REACT_APP_CLIENT_SECRET } from '../../Constants';
import { storeUserSession } from '../utilities/userSession';

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

      userSession.id = response.userId;
      userSession.fordProfileId = response.fordProfileId;
      userSession.accessToken = response.accessToken;
      userSession.refreshToken = response.refreshToken;
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

const getCarImageFull = async (userSession: any, props: any) => {
  const curTimestampSeconds = Math.floor(new Date().getTime() / 1000);

  if (curTimestampSeconds >= userSession.accessExpiresAtSeconds) {
    console.log('API CALL getCarImageFull', 'refreshing tokens');
    await refreshTokens(userSession, props);
    return await getCarImageFull(props.userSession.current, props);
  }
  else {
    console.log('API CALL getCarImageFull', 'getting image');

    let data;

    await RNFetchBlob.fetch('GET', 'https://api.mps.ford.com/api/fordconnect/vehicles/v1/8a7f9fa878849d8a0179579d2f26043a/images/full?make=Ford&model=&year=2019', {
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

export { loginUser, refreshTokens, getCarImageFull }