import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./signin.css";
import { CircularProgress } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import {
  selectAuth,
  selectAuthUser,
  signinAsync,
} from "../../app/slices/authSlice";
import { socketRemoveUser } from "../../app/slices/socketSlice";

export interface UserCredentials {
  email: string;
  password: string;
}

export default function Signin() {
  const email = useRef<any>();
  const password = useRef<any>();
  const dispatch = useDispatch();
  const auth = useAppSelector(selectAuth);

  const isFetching = auth.isFetching;

  const authUser = useAppSelector(selectAuthUser);

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

 

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Lamasocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on
            Lamasocial.
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
            <input
              placeholder="Password"
              type="password"
              required
              minLength={6}
              className="loginInput"
              ref={password}
            />
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
