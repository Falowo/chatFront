import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./signin.css";
import { CircularProgress } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import {
  selectAuth,
  signinAsync,
} from "../../app/slices/authSlice";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
export interface UserCredentials {
  email: string;
  password: string;
}

export default function Signin() {
  const email = useRef<any>();
  const password = useRef<any>();
  const [passwordType, setPasswordType] =
    useState("password");
  const dispatch = useDispatch();
  const auth = useAppSelector(selectAuth);

  const isFetching = auth?.isFetching;

  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();
    const userCredentials = {
      email: email?.current?.value
        ? email?.current?.value
        : "",
      password: password?.current?.value,
    };
    console.log({ userCredentials });
    dispatch(signinAsync(userCredentials));
  };
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Ifapp</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on
            Ifapp.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
            />
            <div className="inputPasswordDiv">
              <input
                placeholder="Password"
                type={passwordType}
                required
                minLength={6}
                className="loginInput"
                ref={password}
              />
              <button
                className="eyeButton"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  togglePassword();
                }}
              >
                {passwordType === "password" ? (
                  <VisibilityIcon className="visibilityIcon"></VisibilityIcon>
                ) : (
                  <VisibilityOffIcon className="bi bi-eye"></VisibilityOffIcon>
                )}
              </button>
            </div>
            <button
              className="loginButton"
              type="submit"
              disabled={isFetching}
            >
              {!!isFetching ? (
                <CircularProgress
                  color="inherit"
                  size="20px"
                />
              ) : (
                "Log In"
              )}
            </button>

         
          </form>
          <span className="loginForgot">
            Forgot Password?
          </span>
          <Link to={"/signup"}>
            <button className="loginRegisterButton">
              {isFetching ? (
                <CircularProgress
                  color="inherit"
                  size="20px"
                />
              ) : (
                "Create a New Account"
              )}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
