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
    // let myHeaders = new Headers();
    // myHeaders.append("api-version", "2020-06-01");
    // myHeaders.append("Application-Id", "afdc085b-377a-4351-b23e-5e1d35fb3700");
    // myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlMxUEZhdzdkR2s3bHNFQmEzUjVWMnRLSzVYYnNIWEJsemFXZGhjNUVNdW8ifQ.eyJpc3MiOiJodHRwczovL2RhaDJ2YjJjcHJvZC5iMmNsb2dpbi5jb20vOTE0ZDg4YjEtMzUyMy00YmY2LTliZTQtMWI5NmI0ZjZmOTE5L3YyLjAvIiwiZXhwIjoxNjI1NjQyNDY0LCJuYmYiOjE2MjU2NDEyNjQsImF1ZCI6ImMxZTRjMWEwLTI4NzgtNGU2Zi1hMzA4LTgzNmIzNDQ3NGVhOSIsImxvY2FsZSI6ImVuIiwiaWRwIjoiYjJjX0RwSzFPQW44ZFEiLCJtdG1JZCI6IjQwYjQ2ZjViLWI4YTAtNDRmNC05ODUzLWMyZjZkNDBiNWQyZiIsInVzZXJHdWlkIjoiSW5hcFgrN21VQlRwR2tEbWRYOUhXT3FMRWJ1NDEzeGlPZXVWcXNSU1p1TE4zZ2svR1lpWWdtTUloL2prLzZlViIsInN1YiI6IjRjZjQwNmM2LTgzNjktNGQwNS04ZGNiLWNjODM3M2E3NDIzMyIsIm5vbmNlIjoiMTIzNDU2Iiwic2NwIjoiYWNjZXNzIiwiYXpwIjoiMzA5OTAwNjItOTYxOC00MGUxLWEyN2ItN2M2YmNiMjM2NThhIiwidmVyIjoiMS4wIiwiaWF0IjoxNjI1NjQxMjY0fQ.RjH_9-DZ1bNqfpolxdPsKywAli9OyMO0rky_IZ5R0JNtfSZ7Z1D_sJpoG5MJUtUWg8x_4fmR89gLe1BVQDruyXNjE5V8BLTBhtfDSi_Hp9wOoNAtXgWZ5qWERC3YLqSIab0X5tRPTBeYqmnpp75yCuPSj4BJ6Y1Bb8PjHem72mNngIyeXBWHQPX3O89FZsbDc-96BQ7EZV644BahlkcgUPhhkPUBcPnvdVlMIGDUq2vWvup9zIBdQ2Ox9SoxxKRsjXxpnUXACvg-PP4OfBB5K9xJ0OJgl8blQSKBoqVlFypbvdhy_YLTncFDOn418KDNTsxI7q96KhVFlspdzYUVRw");

    // let requestOptions: any = {
    //   method: 'GET',
    //   headers: myHeaders,
    //   redirect: 'follow'
    // };

    // let data = undefined;

    // await fetch("https://api.mps.ford.com/api/fordconnect/vehicles/v1/8a7f9fa878849d8a0179579d2f26043a/images/full?make=Ford&model=&year=2019", requestOptions)
    //   .then(response => {
    //     console.log(response.text())
    //   })
    //   .then(result => {
    //     console.log(result)
    //   })
    //   .catch(error => {
    //     console.log('error', error)
    //   });

    let data;

    await RNFetchBlob.fetch('GET', 'https://api.mps.ford.com/api/fordconnect/vehicles/v1/8a7f9fa878849d8a0179579d2f26043a/images/full?make=Ford&model=&year=2019', {
      "Authorization": `Bearer ${userSession.accessToken}`,
      "api-version": REACT_APP_API_VERSION,
      "Application-Id": REACT_APP_APPLICATION_ID
    })
      .then((res) => {
        let status = res.info().status;

        if (status == 200) {
          // the conversion is done in native code
          let base64Str = res.base64()
          // the following conversions are done in js, it's SYNC
          // let text = res.text()
          // let json = res.json()

          data = 'data:image/png;base64,' + base64Str;
        } else {
          // handle other status codes
        }
      });

    return data;
  }
}

export { loginUser, refreshTokens, getCarImageFull }