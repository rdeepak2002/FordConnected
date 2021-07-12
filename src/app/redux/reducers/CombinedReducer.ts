import { combineReducers } from 'redux';
import { friendsReducer } from './FriendsReducer';
import { userSessionReducer } from './UserSessionReducer';
import { vehiclesReducer } from './VehiclesReducer';

const combinedReducer = combineReducers({
  userSession: userSessionReducer,
  vehicles: vehiclesReducer,
  friends: friendsReducer,
});

export default combinedReducer;