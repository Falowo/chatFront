import React from "react";
import {
  Link,
  // useNavigate
} from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import { selectCurrentUser } from "../../app/slices/authSlice";
import { sendFriendRequestAsync } from "../../app/slices/currentUserSlice";
// import { useAppDispatch } from "../../app/hooks";
import "./popupUser.css";

export default function PopupUser(props: {
  userId: string;
}) {
  const { userId } = props;
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  // const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  return (
    <div className="popup">
      <Link
        to={`/messenger/${userId}`}
        className="popupAction"
        onClick={(e) => {
          e.preventDefault();
          currentUser?._id &&
            dispatch(sendFriendRequestAsync(userId));
        }}
      >
        Send a friend request
      </Link>
      <Link
        to={`/messenger/${userId}`}
        className="popupAction"
      >
        Send a message
      </Link>
      <Link
        to={`/messenger/${userId}`}
        className="popupAction"
      >
        Follow
      </Link>
    </div>
  );
}
