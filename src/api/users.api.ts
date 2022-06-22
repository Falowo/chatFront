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

export const getFollowersByUserIdParams = (
  userId: string,
) => {
  return instance().get(`users/followers/${userId}`);
};
export const getFollowedUsersByUserIdParams = (
  userId: string,
) => {
  return instance().get(`users/followedUsers/${userId}`);
};

export const unfollowUser = (userId: string) => {
  return instance().put(`users/${userId}/unfollow`, {});
};

export const followUser = (userId: string) => {
  return instance().put(`users/${userId}/follow`, {});
};
export const addFriend = (userId: string) => {
  return instance().put(`users/${userId}/addFriend`, {});
};
export const sendFriendRequest = (userId: string) => {
  return instance().put(
    `users/${userId}/friendRequest`,
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
