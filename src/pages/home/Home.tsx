import { useEffect } from "react";
import Topbar from "../../components/topbar/Topbar";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css";

import { useAppDispatch } from "../../app/hooks";

import { checkExp } from "../../app/slices/authSlice";
import { setSelectedUserAsync } from "../../app/slices/selectedUserSlice";
import CookieConsent from "react-cookie-consent";
import Messenger from "../messenger/Messenger";

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkExp());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setSelectedUserAsync());
  });

  return (
    <div>
      <Topbar />
      <div className="homeContainer">
        <CookieConsent>
          This website uses cookies to enhance the user
          experience.
        </CookieConsent>
        <Messenger />
        {window.innerWidth >= 900 && <Rightbar />}
      </div>
    </div>
  );
}
