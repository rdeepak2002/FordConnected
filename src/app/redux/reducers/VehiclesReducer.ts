const VEHICLES_INITIAL_STATE = {
  current: [],
  possible: [],
};

export const vehiclesReducer = (state = VEHICLES_INITIAL_STATE, action) => {    
  switch (action.type) {
    case 'ADD_VEHICLE':
      const {
        current,
      } = state;

      const addedVehicle = action.payload;
      current.push(addedVehicle);
      
      const newState = { current };

      return newState;
    default:
      return state
  }
};