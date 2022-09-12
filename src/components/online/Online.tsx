import { IUser } from "../../interfaces";
import "./online.css";
import { selectConnectedUsers } from "../../app/slices/socketSlice";
import { useAppSelector } from "../../app/hooks";
import { useEffect, useState } from "react";

export interface OnlineProps {
  user: IUser;
}

export default function Online(props: OnlineProps) {
  const { user } = props;
  const connectedUsers = useAppSelector(
    selectConnectedUsers,
  );
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    if (
      connectedUsers.find(
        ({ userId }) => userId === user._id,
      )
    ) {
      setIsOnline(true);
    }
  }, [connectedUsers, user._id]);

  return (
    <li className="rightbarFriend">
      <div className="rightbarProfileImgContainer">
        <img
          className="rightbarProfileImg"
          src={`${
            user.profilePicture
              ? PF! + user.profilePicture
              : PF! + "person/noAvatar.webp"
          }`}
          alt=""
        />
        {!!isOnline && (
          <span className="rightbarOnline"></span>
        )}
      </div>
      <span className="rightbarUsername">
        {user.username}
      </span>
    </li>
  );
}
