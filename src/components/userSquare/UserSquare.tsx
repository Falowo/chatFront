import React from "react";
import { IUser } from "../../interfaces";
import "./userSquare.css"

const PF = process.env.REACT_APP_PUBLIC_FOLDER;

export default function UserSquare(props: {
  friend: IUser;
}) {
  const { friend } = props;
  return (
    <div className="rightbarFollowing">
      <img
        src={
          friend.profilePicture
            ? PF + friend.profilePicture
            : PF + "person/noAvatar.png"
        }
        alt=""
        className="rightbarFollowingImg"
      />
      <span className="rightbarFollowingName">
        {friend.username}
      </span>
    </div>
  );
}
