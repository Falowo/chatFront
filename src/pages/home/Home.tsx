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
import { selectCurrentUserRelatives } from "../../app/slices/currentUserSlice";
import { selectCurrentUser } from "../../app/slices/currentUserSlice";
import { checkExp } from "../../app/slices/authSlice";
import { setSelectedUserAsync } from "../../app/slices/selectedUserSlice";
import CookieConsent from "react-cookie-consent";

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

  useEffect(() => {
    dispatch(setSelectedUserAsync());
  });

  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <CookieConsent>
          This website uses cookies to enhance the user
          experience.
        </CookieConsent>
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
