import "./sidebar.css";
import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,
} from "@material-ui/icons";
// import { Users } from "../../dummyData";
import CloseFriend from "../closeFriend/CloseFriend";
import { useAppSelector } from "../../app/hooks";
import {
  selectFriendsOfCurrentUser,
  selectCurrentUserRelatives,
} from "../../app/slices/currentUserSlice";
import SquareOpon from "./square-opon-ifa-black.jpg";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const currentUserFriends = useAppSelector(
    selectFriendsOfCurrentUser,
  );
  const currentUserRelatives = useAppSelector(
    selectCurrentUserRelatives,
  );

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">
              Feed
            </span>
          </li>
          <li className="sidebarListItem">
            <Chat className="sidebarIcon" />
            <span className="sidebarListItemText">
              Chats
            </span>
          </li>
          <li className="sidebarListItem">
            <PlayCircleFilledOutlined className="sidebarIcon" />
            <span className="sidebarListItemText">
              Videos
            </span>
          </li>
          <li className="sidebarListItem">
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">
              Groups
            </span>
          </li>
          <li className="sidebarListItem">
            <NavLink
              to="/ifaCity"
              className="ifaLink"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                className="oponImage"
                src={SquareOpon}
                alt="opon_image"
              />
              <span className="sidebarListItemText">
                Ifa city
              </span>
            </NavLink>
          </li>
          <li className="sidebarListItem">
            <Bookmark className="sidebarIcon" />
            <span className="sidebarListItemText">
              Bookmarks
            </span>
          </li>
          <li className="sidebarListItem">
            <HelpOutline className="sidebarIcon" />
            <span className="sidebarListItemText">
              Questions
            </span>
          </li>
          <li className="sidebarListItem">
            <WorkOutline className="sidebarIcon" />
            <span className="sidebarListItemText">
              Jobs
            </span>
          </li>
          <li className="sidebarListItem">
            <Event className="sidebarIcon" />
            <span className="sidebarListItemText">
              Events
            </span>
          </li>
          <li className="sidebarListItem">
            <School className="sidebarIcon" />
            <span className="sidebarListItemText">
              Courses
            </span>
          </li>
        </ul>
        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />
        {!currentUserRelatives.isFetching ? (
          <ul className="sidebarFriendList">
            {!!currentUserFriends?.length &&
              currentUserFriends?.map((u) => (
                <CloseFriend key={u._id} user={u} />
              ))}
          </ul>
        ) : (
          <h5>Fetching...</h5>
        )}
      </div>
    </div>
  );
}
