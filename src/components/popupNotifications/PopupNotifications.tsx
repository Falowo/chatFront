import React, { useEffect, useState } from "react";
import {
  Link,
  // useNavigate
} from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import {
  checkAcceptedFriendRequestsAsync,
  selectFriendsOfCurrentUser,
  selectNotCheckedAcceptedFriendRequestsBy,
} from "../../app/slices/currentUserSlice";
import { IUser } from "../../interfaces";
// import { useAppDispatch } from "../../app/hooks";
import "./popupNotifications.css";

export default function PopupNotifications() {
  const [newFriends, setNewFriends] = useState<IUser[]>([]);
  const notCheckedAcceptedFriendRequestsBy = useAppSelector(
    selectNotCheckedAcceptedFriendRequestsBy,
  );

  const friendsOfCurrentUser = useAppSelector(
    selectFriendsOfCurrentUser,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    !newFriends.length &&
      !!friendsOfCurrentUser.length &&
      !!notCheckedAcceptedFriendRequestsBy.length &&
      setNewFriends(
        friendsOfCurrentUser.filter(
          (f) =>
            !!notCheckedAcceptedFriendRequestsBy.includes(
              f._id!,
            ),
        ),
      );
  }, [
    friendsOfCurrentUser,
    newFriends.length,
    notCheckedAcceptedFriendRequestsBy,
  ]);

  useEffect(() => {
    return () => {
      !!newFriends.length &&
        dispatch(checkAcceptedFriendRequestsAsync());
    };
  }, [dispatch, newFriends.length]);

  return (
    <div className="popup">
      {!!newFriends.length &&
        newFriends?.map((f) => (
          <Link
            to={`/profile/${f.username}`}
            className="popupAction"
            key={f._id!}
          >
            {`${f.username} accepted your friend request`}
          </Link>
        ))}
    </div>
  );
}
