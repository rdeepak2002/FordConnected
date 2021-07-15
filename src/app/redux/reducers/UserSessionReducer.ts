const USER_SESSION_INITIAL_STATE = {
  current: undefined,
  profilePicture: 'https://firebasestorage.googleapis.com/v0/b/ford-connected.appspot.com/o/blank-profile.png?alt=media&token=46bcf065-df1f-40f2-94c6-a33c58f39556'
};

export const userSessionReducer = (state = USER_SESSION_INITIAL_STATE, action) => {
  let {
    current,
    profilePicture
  } = state;

  switch (action.type) {
    case 'SET_USER_PROFILE_PICTURE':
      profilePicture = action.payload;

      const newPicState = { current, profilePicture };

      return newPicState;
    case 'SET_USER_SESSION':
      current = action.payload;

      const newUserState = { current, profilePicture };

      return newUserState;
    default:
      return state
  }
};