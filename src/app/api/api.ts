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
  let formdata = new FormData();
  formdata.append("grant_type", "refresh_token");
  formdata.append("refresh_token", refreshToken);
  formdata.append("client_id", REACT_APP_CLIENT_ID);
  formdata.append("client_secret", REACT_APP_CLIENT_SECRET);

  let requestOptions: any = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };

  let result = undefined;
  let error = undefined;

  await fetch("https://dah2vb2cprod.b2clogin.com/914d88b1-3523-4bf6-9be4-1b96b4f6f919/oauth2/v2.0/token?p=B2C_1A_signup_signin_common", requestOptions)
    .then(responseIn => responseIn.text())
    .then(resultIn => result = JSON.parse(resultIn))
    .catch(errorIn => error = errorIn);

  if(result) {
    const newAccessToken = result.access_token;
    const newRefreshToken = result.refresh_token;
    const newAccessExpiresAtSeconds = parseInt(result.expires_on);
    const newRefreshExpiresAtSeconds = curTimestampSeconds + parseInt(result.refresh_token_expires_in);

    userSession.accessToken = newAccessToken;
    userSession.refreshToken = newRefreshToken;
    userSession.accessExpiresAtSeconds = newAccessExpiresAtSeconds;
    userSession.refreshExpiresAtSeconds = newRefreshExpiresAtSeconds;

    props.setUserSession(userSession);
  }

  return [result, error];
}

export { loginUser, refreshTokens }