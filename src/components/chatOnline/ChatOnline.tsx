import React from "react";
import { IUser } from "../../interfaces";
import "./chatOnline.css";
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

interface ChatOnlineProps{
  user:IUser;
}

const ChatOnline = (props: ChatOnlineProps) => {
  const {user} = props;
  return (
    <div className="chatOnline">
      <div className="chatOnlineFriend">
        <div className="chatOnlineImageContainer">
          <img
            className="chatOnlineImg"
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt="Bart"
          />
          <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">
          {user.username}
        </span>
      </div>
    </div>
  );
};

export default ChatOnline;
