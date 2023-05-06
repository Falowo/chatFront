import React from "react";
import {
  Link,
  // useNavigate
} from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import {
  acceptFriendRequestAsync,
  declineFriendRequestAsync,
  selectCurrentUser,
  sendFriendRequestAsync,
} from "../../app/slices/currentUserSlice";
import {
  selectFriendRequestsFrom,
  selectFriendRequestsTo,
  selectFriendsOfCurrentUser,
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


  return (
    <div className="popup">
      {!!currentUser &&
        userId !== currentUser?._id! &&
        !friendsOfCurrentUser
          .map((f) => f._id!)
          .includes(userId) &&
        !friendRequestsTo.includes(userId) &&
        !friendRequestsFrom
          .map((f) => f._id!)
          .includes(userId) && (
          <Link
            to={`/`}
            className="popupAction"
            onClick={(e) => {
              e.preventDefault();
              currentUser?._id &&
                dispatch(sendFriendRequestAsync(userId));
            }}
          >
            Add as Friend
          </Link>
        )}
      {!!currentUser &&
        userId !== currentUser?._id! &&
        !friendsOfCurrentUser
          .map((f) => f._id!)
          .includes(userId) &&
        !friendRequestsTo.includes(userId) &&
        !!friendRequestsFrom
          .map((f) => f._id!)
          .includes(userId) && (
          <Link
            to={`/`}
            className="popupAction"
            onClick={(e) => {
              e.preventDefault();
              currentUser?._id &&
                dispatch(acceptFriendRequestAsync(userId));
            }}
          >
            Accept friend request
          </Link>
        )}
      {!!currentUser &&
        userId !== currentUser?._id! &&
        !friendsOfCurrentUser
          .map((f) => f._id!)
          .includes(userId) &&
        !friendRequestsTo.includes(userId) &&
        !!friendRequestsFrom
          .map((f) => f._id!)
          .includes(userId) && (
          <Link
            to={`/`}
            className="popupAction"
            onClick={(e) => {
              e.preventDefault();
              currentUser?._id &&
                dispatch(declineFriendRequestAsync(userId));
            }}
          >
            Decline friend request
          </Link>
        )}
      

      {!!currentUser && userId !== currentUser?._id! && (
        <Link to={`/${userId}`} className="popupAction">
          Send a message
        </Link>
      )}
    </div>
  );
}
