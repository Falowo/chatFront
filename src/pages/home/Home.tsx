import { useEffect } from "react";
import Topbar from "../../components/topbar/Topbar";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css";

import { useAppDispatch } from "../../app/hooks";

import { checkExp } from "../../app/slices/authSlice";
import CookieConsent from "react-cookie-consent";
import Messenger from "../../components/messenger/Messenger";
import { useParams } from "react-router-dom";

export default function Home() {
  const dispatch = useAppDispatch();
  const { userId } = useParams();

  useEffect(() => {
    console.log(userId);
  }, [userId]);

  useEffect(() => {
    dispatch(checkExp());
  }, [dispatch]);

  return (
    <div style={{ width: "100%" }}>
      <Topbar />
      <div className="homeContainer">
        <CookieConsent>
          This website uses cookies to enhance the user
          experience.
        </CookieConsent>
        <Messenger userId={userId} />
        {window.innerWidth >= 900 && <Rightbar />}
      </div>
    </div>
  );
}
