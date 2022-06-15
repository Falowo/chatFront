import { useRef } from "react";
import "./signup.css";
// import { useNavigate } from "react-router";
import {
  // useAppSelector,
  useAppDispatch,
} from "../../app/hooks";
import { IUser } from "../../interfaces";
import { signupAsync } from "../../app/slices/authSlice";

export default function Signup() {
  const username = useRef<any>();
  const email = useRef<any>();
  const password = useRef<any>();
  const passwordAgain = useRef<any>();
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
      const user:IUser = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      console.log({user});
      
      dispatch(signupAsync(user));
      
    }
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
            <input
              placeholder="Password"
              required
              ref={password}
              className="loginInput"
              type="password"
              minLength={6}
            />
            <input
              placeholder="Password Again"
              required
              ref={passwordAgain}
              className="loginInput"
              type="password"
            />
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
