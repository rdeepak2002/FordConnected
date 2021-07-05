import EncryptedStorage from 'react-native-encrypted-storage';

async function storeUserSession(
  id: string,
  username: string,
  firstName: string,
  lastName: string,
  refreshToken: string,
  accessToken: string,
  fordProfileId: string,
  expiresAtSeconds: number
) {
  try {
    const userData = {
      id: id,
      username: username,
      firstName: firstName,
      lastName: lastName,
      refreshToken: refreshToken,
      accessToken: accessToken,
    };

    await EncryptedStorage.setItem('user_session', JSON.stringify(userData));
  } catch (error) {
    console.error(error);
  }
}

async function retrieveUserSession() {
  try {
    const session: any = await EncryptedStorage.getItem('user_session');

    if(session) {
      return JSON.parse(session);
    }
    else {
      return undefined;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function removeUserSession() {
  try {
    await EncryptedStorage.removeItem('user_session');
  } catch (error) {
    console.error(error);
  }
}

async function clearStorage() {
  try {
    await EncryptedStorage.clear();
  } catch (error) {
    console.error(error);
  }
}

export {storeUserSession, retrieveUserSession, removeUserSession, clearStorage};
