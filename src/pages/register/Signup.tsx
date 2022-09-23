import { useRef, useState } from "react";
import "./signup.css";
// import { useNavigate } from "react-router";
import {
  // useAppSelector,
  useAppDispatch,
} from "../../app/hooks";
import { IUser } from "../../interfaces";
import { signupAsync } from "../../app/slices/authSlice";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function Signup() {
  const username = useRef<any>();
  const email = useRef<any>();
  const password = useRef<any>();
  const passwordAgain = useRef<any>();
  const [passwordType, setPasswordType] =
    useState("password");
  const [againPasswordType, setAgainPasswordType] =
    useState("password");
  const dispatch = useAppDispatch();

  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      passwordAgain.current.value !== password.current.value
    ) {
      passwordAgain.current.setCustomValidity(
        "Passwords don't match!",
      );
    } else {
      const user: IUser = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      console.log({ user });

      dispatch(signupAsync(user));
    }
  };

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };
  const toggleAgainPassword = () => {
    if (againPasswordType === "password") {
      setAgainPasswordType("text");
      return;
    }
    setAgainPasswordType("password");
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
              placeholder="Username"
              required
              ref={username}
              className="loginInput"
            />
            <input
              placeholder="Email"
              required
              ref={email}
              className="loginInput"
              type="email"
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
          
            <div className="inputPasswordDiv">
              <input
                type={againPasswordType}
                placeholder="Password Again"
                required
                ref={passwordAgain}
                className="loginInput"
              />
              <button
                className="eyeButton"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  toggleAgainPassword();
                }}
              >
                {passwordType === "password" ? (
                  <VisibilityIcon className="visibilityIcon"></VisibilityIcon>
                ) : (
                  <VisibilityOffIcon className="bi bi-eye"></VisibilityOffIcon>
                )}
              </button>
            </div>
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <button className="loginRegisterButton">
              Log into Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
