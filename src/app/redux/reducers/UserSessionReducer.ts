const USER_SESSION_INITIAL_STATE = {
  current: undefined,
};

export const userSessionReducer = (state = USER_SESSION_INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_USER_SESSION':
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