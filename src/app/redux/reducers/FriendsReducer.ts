const FRIENDS_INITIAL_STATE = {
  current: undefined,
  requested: undefined
};

export const friendsReducer = (state = FRIENDS_INITIAL_STATE, action) => {  
  let {
    current,
    requested
  } = state;

  switch (action.type) {
    case 'SET_FRIENDS_REQUESTED':
      requested = action.payload;

      const newRequestedFriendsState = { current, requested };

      return newRequestedFriendsState;
    case 'SET_FRIENDS':
      current = action.payload;

      const newFriendsState = { current, requested };

      return newFriendsState;
    default:
      return state
  }
};