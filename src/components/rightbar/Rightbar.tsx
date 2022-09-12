import "./rightbar.css";
// import { Users } from "../../dummyData";
import Online from "../online/Online";
import { Box } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Add, Remove } from "@material-ui/icons";

import {
  useAppSelector,
  useAppDispatch,
} from "../../app/hooks";
import {
  selectCurrentUser,
  selectEditInfoMode,
  setEditInfoMode,
 
} from "../../app/slices/currentUserSlice";
import {
  followUserAsync,
  selectFriendsOfCurrentUser,
  selectCurrentUserRelatives,
  selectFollowedByCurrentUser,
  unfollowUserAsync,
} from "../../app/slices/currentUserSlice";
import {
  selectFollowedBySelectedUser,
  selectFriendsOfSelectedUser,
  selectSelectedUser,
  selectSelectedUserAndRelatives,
} from "../../app/slices/selectedUserSlice";
import UserSquare from "../userSquare/UserSquare";
import ProfileInfoForm from "../profileInfoForm/ProfileInfoForm";



export default function Rightbar() {
  const { username } = useParams();
  const currentUser = useAppSelector(selectCurrentUser);
  const selectedUser = useAppSelector(selectSelectedUser);
  const selectedUserAndRelatives = useAppSelector(
    selectSelectedUserAndRelatives,
  );
  const selectedUserFriends = useAppSelector(
    selectFriendsOfSelectedUser,
  );
  const currentUserRelatives = useAppSelector(
    selectCurrentUserRelatives,
  );

  const currentUserFriends = useAppSelector(
    selectFriendsOfCurrentUser,
  );
  const followedByCurrentUser = useAppSelector(
    selectFollowedByCurrentUser,
  );
  const followedBySelectedUser = useAppSelector(
    selectFollowedBySelectedUser,
  );

  const [isCurrentUserPage, setIsCurrentUserPage] =
    useState<boolean>(
      !!(currentUser?._id === selectedUser?._id),
    );

  const dispatch = useAppDispatch();

  const [followed, setFollowed] = useState<boolean>(
    !!followedByCurrentUser?.length
      ? !!followedByCurrentUser
          ?.map((f) => f._id!)
          .includes(selectedUser?._id!)
      : false,
  );

  const editInfoMode = useAppSelector(selectEditInfoMode);

  useEffect(() => {
    setFollowed(
      !!followedByCurrentUser?.length
        ? !!followedByCurrentUser
            ?.map((f) => f._id!)
            .includes(selectedUser?._id!)
        : false,
    );
  }, [followedByCurrentUser, selectedUser?._id, username]);

  useEffect(() => {
    !!currentUser?._id &&
      !!selectedUser?._id &&
      setIsCurrentUserPage(
        !!(currentUser?._id === selectedUser?._id),
      );
  }, [currentUser?._id, selectedUser?._id]);

  const handleClick = async () => {
    if (!!selectedUser && !!currentUser) {
      try {
        if (followed) {
          dispatch(
            unfollowUserAsync({
              userId: selectedUser!._id!,
            }),
          );
        } else {
          dispatch(
            followUserAsync({
              userId: selectedUser!._id!,
            }),
          );
        }
        setFollowed(!followed);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    setFollowed(
      !!followedByCurrentUser?.length
        ? !!followedByCurrentUser
            ?.map((f) => f._id!)
            .includes(selectedUser?._id!)
        : false,
    );
  }, [
    currentUser,
    followedByCurrentUser,
    selectedUser?._id,
  ]);

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img
            className="birthdayImg"
            src="assets/gift.png"
            alt=""
          />
          <span className="birthdayText">
            <b>Ceeza Milli</b> and <b>3 other friends</b>{" "}
            have their birhday today.
          </span>
        </div>
        <img
          className="rightbarAd"
          src="assets/kame-house.jpg"
          alt=""
        />
        {!currentUserRelatives.isFetching ? (
          <h4 className="rightbarTitle">Your Friends</h4>
        ) : (
          <h4>Loading</h4>
        )}

        <ul className="rightbarFriendList">
          {!currentUserRelatives.isFetching &&
            !!currentUserFriends?.length &&
            currentUserFriends?.map((u) => (
              <Link
                to={`/messenger/${u._id!}`}
                key={u._id}
                className="link"
              >
                <Online key={u._id} user={u} />
              </Link>
            ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {!!selectedUser &&
          selectedUser?._id !== currentUser?._id && (
            <button
              className="rightbarFollowButton"
              onClick={handleClick}
            >
              {followed ? "Unfollow" : "Follow"}
              {followed ? <Remove /> : <Add />}
            </button>
          )}
        <Box
          sx={{
            display: "flex",
            flexWrap: "nowrap",
            alignItems: "end",
          }}
        >
          {!!isCurrentUserPage ? (
            <>
              <h4 className="rightbarTitle">About you</h4>
              <button className="editInfoButton">
                <CreateIcon
                  sx={{
                    border: 1,
                    borderRadius: "25%",
                    padding: 0.7,
                    marginRight: "0.5rem",
                    marginLeft: "2rem",
                    fontSize: "large",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    dispatch(setEditInfoMode(!editInfoMode))
                  }
                />
              </button>
            </>
          ) : (
            <h4 className="rightbarTitle">
              About {selectedUser?.username}
            </h4>
          )}
        </Box>

        <>
          {!!editInfoMode ? (
            <ProfileInfoForm />
          ) : (
            <div className="rightbarInfo">
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">
                  City:
                </span>
                <span className="rightbarInfoValue">
                  {!!isCurrentUserPage
                    ? currentUser?.city
                    : selectedUser?.city}
                </span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">
                  From:
                </span>
                <span className="rightbarInfoValue">
                  {!!isCurrentUserPage
                    ? currentUser?.from
                    : selectedUser?.from}
                </span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">
                  Relationship:
                </span>
                <span className="rightbarInfoValue">
                  {!!isCurrentUserPage
                    ? currentUser?.relationship === 1
                      ? "Single"
                      : currentUser?.relationship === 2
                      ? "Married"
                      : "-"
                    : selectedUser?.relationship === 1
                    ? "Single"
                    : selectedUser?.relationship === 2
                    ? "Married"
                    : "-"}
                </span>
              </div>
            </div>
          )}
        </>
        <h4 className="rightbarTitle">
          {username}'s friends
        </h4>
        <div className="rightbarFollowings">
          {!isCurrentUserPage ? (
            !selectedUserAndRelatives.isFetching ? (
              selectedUserFriends?.map((friend) => (
                <Link
                  key={friend._id}
                  to={"/profile/" + friend.username}
                  style={{ textDecoration: "none" }}
                >
                  <UserSquare
                    key={friend._id!}
                    friend={friend}
                  />
                </Link>
              ))
            ) : (
              <p>uploading...</p>
            )
          ) : (
            currentUserFriends?.map((friend) => (
              <Link
                key={friend._id}
                to={"/profile/" + friend.username}
                style={{ textDecoration: "none" }}
              >
                <UserSquare
                  key={friend._id!}
                  friend={friend}
                />
              </Link>
            ))
          )}
        </div>
        <h4 className="rightbarTitle">
          {username} is following :
        </h4>
        <div className="rightbarFollowings">
          {!isCurrentUserPage ? (
            !selectedUserAndRelatives.isFetching ? (
              followedBySelectedUser?.map((friend) => (
                <Link
                  key={friend._id}
                  to={"/profile/" + friend.username}
                  style={{ textDecoration: "none" }}
                >
                  <UserSquare
                    key={friend._id!}
                    friend={friend}
                  />
                </Link>
              ))
            ) : (
              <p>uploading...</p>
            )
          ) : (
            followedByCurrentUser?.map((friend) => (
              <Link
                key={friend._id}
                to={"/profile/" + friend.username}
                style={{ textDecoration: "none" }}
              >
                <UserSquare
                  key={friend._id!}
                  friend={friend}
                />
              </Link>
            ))
          )}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {!!username ? (
          <ProfileRightbar />
        ) : (
          <HomeRightbar />
        )}
      </div>
    </div>
  );
}
