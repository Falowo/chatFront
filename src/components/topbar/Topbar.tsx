import "./topbar.css";
import {
  Search,
  Person,
  Chat,
  Notifications,
} from "@material-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import {
  useAppSelector,
  useAppDispatch,
} from "../../app/hooks";
import { selectCurrentUser } from "../../app/slices/authSlice";
import { useEffect, useRef, useState } from "react";
import {
  searchUsersByUserNamePartAsync,
  // selectSearchUsers,
} from "../../app/slices/searchSlice";
import {
  getFollowedByCurrentUserAsync,
  selectFollowedByCurrentUser,
} from "../../app/slices/currentUserSlice";
import { selectUncheckedByCurrentUser } from "../../app/slices/messengerSlice";
// import {
//   selectConnectedUsers,
//   selectSocket,
//   socketAddUserAsync,
// } from "../../app/slices/socketSlice";

export default function Topbar() {
  const currentUser = useAppSelector(selectCurrentUser);
  // const socket = useAppSelector(selectSocket);
  // const connectedUsers = useAppSelector(
  //   selectConnectedUsers,
  // );
  const followedByCurrentUser = useAppSelector(
    selectFollowedByCurrentUser,
  );
  const uncheckedByCurrentUser = useAppSelector(
    selectUncheckedByCurrentUser,
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const searchRef = useRef<HTMLInputElement>(null);
  let timeout: NodeJS.Timeout;

  const [
    reducedUncheckedByCurrentUser,
    setReducedUncheckedByCurrentUser,
  ] = useState<number>(0);

  const handleSearchChange = () => {
    if (!!timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      !!searchRef?.current?.value &&
        dispatch(
          searchUsersByUserNamePartAsync({
            usernamePart: searchRef.current?.value,
            followedByCurrentUserIds:
              followedByCurrentUser?.map((f) => f._id!) ||
              [],
          }),
        );
      if (!!searchRef?.current?.value) {
        searchRef.current.value = "";
        navigate("/search");
      }
    }, 1000);
  };

  useEffect(() => {
    uncheckedByCurrentUser?.length &&
      setReducedUncheckedByCurrentUser(
        uncheckedByCurrentUser?.reduce(
          (prev, curr) => prev + curr.messagesIds?.length,
          0,
        ) || 0,
      );
  }, [uncheckedByCurrentUser]);

  useEffect(() => {
    !!currentUser &&
      dispatch(
        getFollowedByCurrentUserAsync(currentUser._id!),
      );
  }, [currentUser, currentUser?._id, dispatch]);

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">JenzBoo</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
            ref={searchRef}
            onChange={(e: React.ChangeEvent) =>
              handleSearchChange()
            }
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Link className="topbarLink" to="/messenger">
              <Chat />
              {reducedUncheckedByCurrentUser > 0 && (
                <span className="topbarIconBadge">
                  {reducedUncheckedByCurrentUser}
                </span>
              )}
            </Link>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <Link
          to={
            !!currentUser
              ? `/profile/${currentUser?.username}`
              : "/signin"
          }
        >
          <img
            src={
              currentUser?.profilePicture
                ? PF + currentUser?.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt="profile"
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}
