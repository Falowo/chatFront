import React from "react";
import {
  Link,
  // useNavigate
} from "react-router-dom";
// import { useAppDispatch } from "../../app/hooks";
import "./popupUser.css";

export default function PopupUser(props: {
  userId: string;
}) {
  const { userId } = props;
  // const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  return (
    <div className="popup">
      <Link
        to={`/messenger/${userId}`}
        className="popupAction"
        onClick={(e) => {
          e.preventDefault();
          console.log("sendFriendRequest");
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
