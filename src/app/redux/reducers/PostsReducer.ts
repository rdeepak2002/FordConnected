const POSTS_INITIAL_STATE = {
  current: undefined,
};

export const postsReducer = (state = POSTS_INITIAL_STATE, action) => {    
  switch (action.type) {
    case 'SET_POSTS':
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