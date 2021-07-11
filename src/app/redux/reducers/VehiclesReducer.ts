const VEHICLES_INITIAL_STATE = {
  current: undefined,
};

export const vehiclesReducer = (state = VEHICLES_INITIAL_STATE, action) => {    
  switch (action.type) {
    case 'SET_VEHICLES':
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