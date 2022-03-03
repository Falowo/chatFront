import { useEffect, useState } from "react";
import "./userSearchElt.css";
import { Add, MoreVert, Remove } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { selectCurrentUser } from "../../app/slices/authSlice";
import {
  useAppSelector,
  useAppDispatch,
} from "../../app/hooks";
import {
  followUserAsync,
  unfollowUserAsync,
} from "../../app/slices/currentUserSlice";
import {
  SearchedUser,
  toggleFollowed,
} from "../../app/slices/searchSlice";
import PopupUser from "../popupUser/PopupUser";

export interface UserSearchProps {
  user: SearchedUser;
}

export default function UserSearchElt(props: UserSearchProps) {
  const { user } = props;
  const [showUserActions, setShowUserActions] = useState(false)

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(showUserActions)
  }, [showUserActions])
  

  const handleClick = async () => {
    if (!!user && !!currentUser) {
      try {
        if (!!user.followed) {
          dispatch(
            unfollowUserAsync({
              userId: user._id!,
            }),
          );
        } else {
          dispatch(
            followUserAsync({
              userId: user._id!,
            }),
          );
        }
        dispatch(toggleFollowed(user._id));
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="user">
      <div className="userWrapper">
        <div className="userTop">
          <div className="userTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="userProfileImg"
                src={
                  user?.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="userUsername">
              {user?.username}
            </span>
          </div>
          <button className="userTopRight"
            onClick={()=>setShowUserActions(!showUserActions)}
          >
            <MoreVert />
          {!!showUserActions &&  <PopupUser
          userId={user._id}
          />}
          </button>
        </div>
      {user._id !== currentUser?._id && (
        <button
          className="followButton"
          onClick={handleClick}
        >
          {!!user.followed ? "Unfollow" : "Follow"}
          {!!user.followed ? <Remove /> : <Add />}
        </button>
      )}
      </div>
    </div>
  );
}
