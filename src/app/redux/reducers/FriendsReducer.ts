const FRIENDS_INITIAL_STATE = {
  current: undefined,
};

export const friendsReducer = (state = FRIENDS_INITIAL_STATE, action) => {    
  switch (action.type) {
    case 'SET_FRIENDS':
      let {
        current
      } = state;

      current = action.payload;

      const newState = { current };

      return newState;
    default:
      return state
  }
};