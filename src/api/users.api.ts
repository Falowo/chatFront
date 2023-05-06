import { instance } from ".";
import {
  ToUpdateUserDesc,
  ToUpdateUserInfo,
} from "../interfaces";

export const getUserByUserIdQuery = (userId: string) => {
  return instance().get(`users?userId=${userId}`);
};

export const getUserByUsernameQuery = (
  username: string,
) => {
  return instance().get(`users?username=${username}`);
};

export const getFriendsByUserIdParams = (
  userId: string,
) => {
  return instance().get(`users/friends/${userId}`);
};

export const addFriend = (userId: string) => {
  return instance().put(`users/${userId}/addFriend`, {});
};
export const removeFriend = (userId: string) => {
  return instance().put(`users/${userId}/removeFriend`, {});
};

export const sendFriendRequest = (userId: string) => {
  return instance().put(
    `users/${userId}/sendFriendRequest`,
    {},
  );
};
export const acceptFriendRequest = (userId: string) => {
  return instance().put(
    `users/${userId}/acceptFriendRequest`,
    {},
  );
};
export const declineFriendRequest = (userId: string) => {
  return instance().put(
    `users/${userId}/declineFriendRequest`,
    {},
  );
};

export const searchUsersByUsernamePartParams = (
  search: string,
) => {
  return instance().get(`users/search/${search}`);
};

export const getBestCurrentUserFriends = () => {
  return instance().get(`users/best/currentUser/friends`);
};

export const getFriendRequestsFrom = () => {
  return instance().get("users/friend/requests/from");
};

export const checkFriendRequests = () => {
  return instance().put(
    "users/currentUser/checkFriendRequests",
  );
};
export const checkAcceptedFriendRequests = () => {
  return instance().put(
    "users/currentUser/checkAcceptedFriendRequests",
  );
};

export const editProfilePicture = (fileName: string) => {
  return instance().put(
    "users/currentUser/editProfilePicture",
    { fileName },
  );
};
export const editCoverPicture = (fileName: string) => {
  return instance().put(
    "users/currentUser/editCoverPicture",
    { fileName },
  );
};

export const updateCurrentUserInfo = (
  toUpdateUserInfo: ToUpdateUserInfo,
) => {
  return instance().put("users/currentUser/updateInfo", {
    toUpdateUserInfo,
  });
};

export const updateCurrentUserDesc = (
  toUpdateUserDesc: ToUpdateUserDesc,
) => {
  console.log(toUpdateUserDesc);

  return instance().put("users/currentUser/updateDesc", {
    toUpdateUserDesc,
  });
};
