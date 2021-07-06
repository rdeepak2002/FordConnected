import axios from 'axios';
import { DEBUG_MODE, REACT_APP_API_URL, REACT_APP_CLIENT_ID, REACT_APP_CLIENT_SECRET } from '../../Constants';

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

const refreshTokens = async (refreshToken: string, userSession: any, props:any, curTimestampSeconds:number): Promise<[response: any, error: any]> => {
  const postData: any = JSON.stringify({
    query: `mutation {
      refreshTokens(refreshToken: "${refreshToken}"){
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

    }
    error = data.data.errors;
  }
  catch (err) {
    error = err;
  }

  return [response, error];
}

export { loginUser, refreshTokens }