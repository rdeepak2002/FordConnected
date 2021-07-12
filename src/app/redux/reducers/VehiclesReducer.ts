const VEHICLES_INITIAL_STATE = {
  current: undefined,
  carImage: undefined
};

export const vehiclesReducer = (state = VEHICLES_INITIAL_STATE, action) => {
  let {
    current,
    carImage
  } = state;

  switch (action.type) {
    case 'SET_VEHICLES':
      current = action.payload;

      const newVehiclesState = { current, carImage };

      return newVehiclesState;
    case 'SET_CAR_IMAGE':
      carImage = action.payload;

      const newCarImageState = { current, carImage };

      return newCarImageState;
    default:
      return state
  }
};