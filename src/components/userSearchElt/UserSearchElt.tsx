import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./userSearchElt.css";
import { Add, MoreVert, Remove } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { selectCurrentUser } from "../../app/slices/currentUserSlice";
import {
  useAppSelector,
  useAppDispatch,
} from "../../app/hooks";
import {
  followUserAsync,
  selectFriendRequestsFrom,
  sendFriendRequestOrAcceptAsync,
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

export default function UserSearchElt(
  props: UserSearchProps,
) {
  const { user } = props;
  const navigate = useNavigate();
  const [showUserActions, setShowUserActions] =
    useState(false);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const currentUser = useAppSelector(selectCurrentUser);
  const friendRequestFrom = useAppSelector(
    selectFriendRequestsFrom,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(showUserActions);
  }, [showUserActions]);

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
            <Link to={`/profile/${user.username}`}
            className="linkClass"
            >
              <img
                className="userProfileImg"
                src={
                  user?.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.webp"
                }
                alt=""
              />
            <span className="userUsername">
              {user?.username}
            </span>
            </Link>
          </div>
          <button
            className="userTopRight"
            onClick={() =>
              setShowUserActions(!showUserActions)
            }
          >
            <MoreVert />
            {!!showUserActions && (
              <PopupUser userId={user._id} />
            )}
          </button>
        </div>
        {user._id !== currentUser?._id &&
          user.followed !== undefined && (
            <button
              className="followButton"
              onClick={handleClick}
            >
              {!!user.followed ? "Unfollow" : "Follow"}
              {!!user.followed ? <Remove /> : <Add />}
            </button>
          )}
        <>
          {!!friendRequestFrom
            ?.map((f) => f._id!)
            .includes(user._id!) &&
            user.followed === undefined && (
              <>
                <button
                  className="followButton"
                  onClick={() => {
                    !!user?._id &&
                      dispatch(
                        sendFriendRequestOrAcceptAsync(user._id!),
                      );
                    navigate("/");
                  }}
                >
                  Accept friend request
                </button>
              </>
            )}
        </>
      </div>
    </div>
  );
}
