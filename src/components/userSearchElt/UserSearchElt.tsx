import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./userSearchElt.css";
import { MoreVert } from "@mui/icons-material";
import { Link } from "react-router-dom";
import {
  addFriendAsync,
  // acceptFriendRequestAsync,
  // addFriendAsync,
  // declineFriendRequestAsync,
  removeFriendAsync,
  selectCurrentUser,
  selectFriendsOfCurrentUser,
} from "../../app/slices/currentUserSlice";
import {
  useAppSelector,
  useAppDispatch,
} from "../../app/hooks";
// import {
// selectFriendRequestsFrom,
// sendFriendRequestAsync,
// } from "../../app/slices/currentUserSlice";
import { SearchedUser } from "../../app/slices/searchSlice";
import PopupUser from "../popupUser/PopupUser";
import {
  socketDeclineFriendRequest,
  socketSendFriendRequest,
} from "../../app/slices/socketSlice";

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

  const [userIsFriend, setUserIsFriend] =
    useState<boolean>(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const currentUser = useAppSelector(selectCurrentUser);
  const friendsOfCurrentUser = useAppSelector(
    selectFriendsOfCurrentUser,
  );
  // const friendRequestFrom = useAppSelector(
  //   selectFriendRequestsFrom,
  // );
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(showUserActions);
  }, [showUserActions]);

  useEffect(() => {
    setUserIsFriend(
      !!friendsOfCurrentUser.length &&
        !!friendsOfCurrentUser
          .map((f) => f._id)
          .includes(user._id),
    );
  }, [currentUser, friendsOfCurrentUser, user]);

  return (
    <div className="user">
      <div className="userWrapper">
        <div className="userTop">
          <div className="userTopLeft">
            <Link
              to={`/profile/${user.username}`}
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

        <>
          <>
            {!userIsFriend && (
              <button
                className="addButton"
                onClick={() => {
                  !!user?._id &&
                    dispatch(
                      addFriendAsync({
                        userId: user._id!,
                      }),
                    );
                  !!currentUser &&
                    dispatch(
                      socketSendFriendRequest({
                        userId: user._id!,
                        currentUserId: currentUser._id!,
                      }),
                    );
                  navigate("/");
                }}
              >
                add Friend
              </button>
            )}

            {userIsFriend && (
              <button
                className="removeButton"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  !!user?._id &&
                    dispatch(
                      removeFriendAsync({
                        userId: user._id!,
                      }),
                    );
                  !!currentUser &&
                    dispatch(
                      socketDeclineFriendRequest({
                        userId: user._id!,
                        currentUserId: currentUser._id!,
                      }),
                    );
                  navigate("/");
                }}
              >
                Remove Friend
              </button>
            )}
          </>
        </>
      </div>
    </div>
  );
}
