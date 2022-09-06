import React from "react";
import {
  Link,
  // useNavigate
} from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import { selectCurrentUser } from "../../app/slices/currentUserSlice";
import {
  followUserAsync,
  selectFollowedByCurrentUser,
  selectFriendRequestsFrom,
  selectFriendRequestsTo,
  selectFriendsOfCurrentUser,
  sendFriendRequestOrAcceptAsync,
  unfollowUserAsync,
} from "../../app/slices/currentUserSlice";
// import { useAppDispatch } from "../../app/hooks";
import "./popupUser.css";

export default function PopupUser(props: {
  userId: string;
}) {
  const { userId } = props;
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const friendRequestsFrom = useAppSelector(
    selectFriendRequestsFrom,
  );
  const friendRequestsTo = useAppSelector(
    selectFriendRequestsTo,
  );
  const friendsOfCurrentUser = useAppSelector(
    selectFriendsOfCurrentUser,
  );
  const followedByCurrentUser = useAppSelector(
    selectFollowedByCurrentUser,
  );
  // const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  return (
    <div className="popup">
      {!!currentUser &&
        userId !== currentUser?._id! && !friendsOfCurrentUser
        .map((f) => f._id!)
        .includes(userId) &&
        !friendRequestsTo.includes(userId) && (
          <Link
            to={`/`}
            className="popupAction"
            onClick={(e) => {
              e.preventDefault();
              currentUser?._id &&
                dispatch(
                  sendFriendRequestOrAcceptAsync(userId),
                );
            }}
          >
            {friendRequestsFrom
              .map((f) => f._id!)
              .includes(userId)
              ? `Accept friend request`
              : `Send a friend request`}
          </Link>
        )}

      {!!currentUser &&
        userId !== currentUser?._id! && (<Link
        to={`/messenger/${userId}`}
        className="popupAction"
      >
        Send a message
      </Link>)}
      {!!currentUser &&
        userId !== currentUser?._id! &&(<Link
        to={`/`}
        className="popupAction"
        onClick={(e) => {
          e.preventDefault();
          !followedByCurrentUser
            .map((f) => f._id)
            .includes(userId)
            ? dispatch(followUserAsync({ userId }))
            : dispatch(unfollowUserAsync({ userId }));
            
        }}
      >
        {followedByCurrentUser
          .map((f) => f._id)
          .includes(userId)
          ? "Unfollow"
          : "Follow"}
      </Link>)}
    </div>
  );
}
