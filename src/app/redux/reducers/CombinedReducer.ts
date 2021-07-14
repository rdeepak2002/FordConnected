import { combineReducers } from 'redux';
import { friendsReducer } from './FriendsReducer';
import { postsReducer } from './PostsReducer';
import { userSessionReducer } from './UserSessionReducer';
import { vehiclesReducer } from './VehiclesReducer';

const combinedReducer = combineReducers({
  userSession: userSessionReducer,
  vehicles: vehiclesReducer,
  friends: friendsReducer,
  posts: postsReducer
});

export default combinedReducer;