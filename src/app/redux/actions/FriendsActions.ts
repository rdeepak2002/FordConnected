export const setFriends = friends => (
  {
    type: 'SET_FRIENDS',
    payload: friends,
  }
);

export const setFriendsRequested = friendsReq => (
  {
    type: 'SET_FRIENDS_REQUESTED',
    payload: friendsReq,
  }
);