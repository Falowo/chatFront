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
import { selectCurrentUser } from "../../app/slices/currentUserSlice";
import { useEffect, useRef, useState } from "react";
import {
  searchUsersByUserNamePartAsync,
  // selectSearchUsers,
} from "../../app/slices/searchSlice";
import {
  checkFriendRequestsAsync,
  getFollowedByCurrentUserAsync,
  selectFriendRequestsFrom,
  selectNotCheckedAcceptedFriendRequestsBy,
  selectNotCheckedFriendRequestsFrom,
} from "../../app/slices/currentUserSlice";
import { selectUncheckedByCurrentUser } from "../../app/slices/messengerSlice";
import PopupNotifications from "../popupNotifications/PopupNotifications";
import LogoutIcon from "@mui/icons-material/Logout";
import { signoutAsync } from "../../app/slices/authSlice";
import { socketRemoveUser } from "../../app/slices/socketSlice";
import { useAuth0 } from "@auth0/auth0-react";

export default function Topbar() {
  const {  isAuthenticated, logout } = useAuth0();

  const [
    showPopupNotifications,
    setShowPopupNotifications,
  ] = useState<boolean>(false);
  const currentUser = useAppSelector(selectCurrentUser);

  const uncheckedByCurrentUser = useAppSelector(
    selectUncheckedByCurrentUser,
  );
  const notCheckedFriendRequestsFrom = useAppSelector(
    selectNotCheckedFriendRequestsFrom,
  );
  const notCheckedAcceptedFriendRequestsBy = useAppSelector(
    selectNotCheckedAcceptedFriendRequestsBy,
  );
  const friendRequestsFrom = useAppSelector(
    selectFriendRequestsFrom,
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
          <span className="logo">Ifapp</span>
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
        {/* <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div> */}
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Link
              className="topbarLink"
              to="/friend/requests"
              onClick={(e) => {
                e.preventDefault();
                dispatch(checkFriendRequestsAsync());
                !!friendRequestsFrom?.length &&
                  navigate("/friend/requests");
              }}
            >
              <Person />
              {!!notCheckedFriendRequestsFrom &&
                notCheckedFriendRequestsFrom.length > 0 && (
                  <span className="topbarIconBadge">
                    {notCheckedFriendRequestsFrom.length}
                  </span>
                )}
            </Link>
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
          <div className="topbarIconItem notifications">
            <Link
              className="topbarLink"
              to="/"
              onClick={(e) => {
                e.preventDefault();
                setShowPopupNotifications(
                  !showPopupNotifications,
                );
              }}
            >
              <Notifications />
              {!!notCheckedAcceptedFriendRequestsBy.length && (
                <span className="topbarIconBadge">
                  {
                    notCheckedAcceptedFriendRequestsBy.length
                  }
                </span>
              )}
            </Link>
            {!!showPopupNotifications && (
              <PopupNotifications />
            )}
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
                : PF + "person/noAvatar.webp"
            }
            alt="profile"
            className="topbarImg"
          />
        </Link>

        <Link
          onClick={() => {
            if (!!currentUser) {
              dispatch(socketRemoveUser());

              dispatch(signoutAsync());
            }

            if (!!isAuthenticated) {
              logout({ returnTo: window.location.origin });
            }
          }}
          to={"/signin"}
        >
          <LogoutIcon
            sx={{
              color: "white",
              fontSize: "1.5rem",
              marginLeft: "0.5rem",
            }}
          />
        </Link>
      </div>
    </div>
  );
}
