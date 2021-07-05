import axios from 'axios';
import { REACT_APP_API_URL } from '../../Constants';

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

  console.log('API CALL loginUser', url);

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

export { loginUser }