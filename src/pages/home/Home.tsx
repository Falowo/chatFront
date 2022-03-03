import { useEffect } from "react";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css";
import { getTimelineAsync } from "../../app/slices/postsSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import {
  getFriendsOfCurrentUserAsync,
  selectCurrentUserRelatives,
} from "../../app/slices/currentUserSlice";
import { selectCurrentUser } from "../../app/slices/authSlice";
import { checkExp } from "../../app/slices/authSlice";

export default function Home() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const currentUserRelatives = useAppSelector(
    selectCurrentUserRelatives,
  );
  const currentUserRelativesIsFetching =
    currentUserRelatives.isFetching;
  useEffect(() => {
    !!currentUser && dispatch(getTimelineAsync());
  }, [currentUser, dispatch]);

  

  useEffect(() => {
    dispatch(checkExp());
  }, [dispatch]);

  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        {!currentUserRelativesIsFetching ? (
          <Feed />
        ) : (
          <h1>Fetching...</h1>
        )}

        <Rightbar />
      </div>
    </>
  );
}
