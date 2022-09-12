import { IUser } from "../../interfaces";
import "./closeFriend.css";

interface CloseFriendProps {
  user: IUser;
}

export default function CloseFriend(props: CloseFriendProps) {
  const { user } = props;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <li className="sidebarFriend">
      <img
        className="sidebarFriendImg"
        src={
          user.profilePicture
            ? PF + user.profilePicture
            : PF + "person/noAvatar.webp"
        }
        alt=""
      />
      <span className="sidebarFriendName">
        {user.username}
      </span>
    </li>
  );
}
