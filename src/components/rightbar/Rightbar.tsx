import "./rightbar.css";
// import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Add, Remove } from "@material-ui/icons";

import {
  useAppSelector,
  useAppDispatch,
} from "../../app/hooks";
import { selectCurrentUser } from "../../app/slices/authSlice";
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

  
  const dispatch = useAppDispatch();

  const [followed, setFollowed] = useState<boolean>(
    !!followedByCurrentUser?.length
      ? !!followedByCurrentUser
          ?.map((f) => f._id!)
          .includes(selectedUser?._id!)
      : false,
  );
  console.log({ selectedUserFriends, currentUserFriends });

  useEffect(() => {
    setFollowed(
      !!followedByCurrentUser?.length
        ? !!followedByCurrentUser
            ?.map((f) => f._id!)
            .includes(selectedUser?._id!)
        : false,
    );
  }, [followedByCurrentUser, selectedUser?._id, username]);

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
            <b>Pola Foster</b> and <b>3 other friends</b>{" "}
            have a birhday today.
          </span>
        </div>
        <img
          className="rightbarAd"
          src="assets/ad.png"
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
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">
              {selectedUser?.city}
            </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">
              {selectedUser?.from}
            </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">
              Relationship:
            </span>
            <span className="rightbarInfoValue">
              {selectedUser?.relationship === 1
                ? "Single"
                : selectedUser?.relationship === 2
                ? "Married"
                : "-"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">{username}'s friends</h4>
        <div className="rightbarFollowings">
          {!selectedUserAndRelatives.isFetching ? (
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
          )}
        </div>
        <h4 className="rightbarTitle">{username} is following :</h4>
        <div className="rightbarFollowings">
          {!selectedUserAndRelatives.isFetching ? (
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
