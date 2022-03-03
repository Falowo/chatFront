
import { toast } from "react-toastify";
import { IUser } from "../../interfaces";
import { Dispatch } from "redux";
import { RootState } from "../reducers/rootReducer";
import { signin, signup } from "../../api/auth.api";

export const SIGN_UP = "Sign Up";
export const SIGN_IN = "Sign In";
export const SIGN_OUT = "Sign Out";
export const LOAD_USER = "Load User";

export interface Creds {
  email: string;
  password: string;
}
export const signUp = (user: IUser) => {
  return (dispatch: Dispatch) => {
    signup(user)
      .then((token) => {
        console.log(token);
        localStorage.setItem("token", token.data);
        dispatch({
          type: "SIGN_UP",
          payload: token.data,
        });
      })
      .catch((error) => {
        toast(error.response?.data, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };
};

export const signIn = (creds: Creds) => {
  return (dispatch: Dispatch) => {
    signin(creds)
      .then((token) => {
        console.log(token);
        localStorage.setItem("token", token.data);
        dispatch({
          type: "SIGN_IN",
          payload: token.data,
        });
      })
      .catch((error) => {
        toast(error.response?.data, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };
};

export const loadUser = () => {
  return (
    dispatch: Dispatch,
    getState: () => RootState,
  ) => {
    const token = getState().authState.token;
    if (token) {
      dispatch({
        type: "USER_LOADED",
        payload: token,
      });
    } else return null;
  };
};

export const Follow = (userId: string) => ({
  type: "FOLLOW",
  payload: userId,
});

export const Unfollow = (userId: string) => ({
  type: "UNFOLLOW",
  payload: userId,
});

export const signOut = () => {
  return (dispatch: Dispatch) => {
    localStorage.removeItem("token");
    dispatch({
      type: "SIGN_OUT",
    });
  };
};
