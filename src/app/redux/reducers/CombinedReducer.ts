import { combineReducers } from 'redux';
import { userSessionReducer } from './UserSessionReducer';
import { vehiclesReducer } from './VehiclesReducer';

const combinedReducer = combineReducers({
  userSession: userSessionReducer,
  vehicles: vehiclesReducer
});

export default combinedReducer;