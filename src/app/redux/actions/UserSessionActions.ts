export const setUserSession = userSession => (
  {
    type: 'SET_USER_SESSION',
    payload: userSession,
  }
);

export const setUserProfilePicture = userProfilePictureUri => (
  {
    type: 'SET_USER_PROFILE_PICTURE',
    payload: userProfilePictureUri,
  }
);