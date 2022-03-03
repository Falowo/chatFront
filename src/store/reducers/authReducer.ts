import { toast } from "react-toastify";
import jwtDecode from "jwt-decode";
import { IUser } from "../../interfaces";

export interface AuthState {
  token: string;
  user: IUser | null;
  exp: number | null;
  isFetching: boolean;
  error: any;
}

export interface Payload {
  user: IUser;
  exp: number;
  iat?: number;
}

const initialState = {
  token: localStorage.getItem("token") || "",
  user: null,
  exp: null,
  isFetching: false,
  error: false,
  
};

const authReducer = (
  state: AuthState = initialState,
  action: {
    type: string;
    payload: string;
  },
) => {
  switch (action.type) {
    case "SIGN_UP":
    case "USER_LOADED":
    case "SIGN_IN":
      toast.success("Welcome...", {
        position: toast.POSITION.BOTTOM_RIGHT,
        delay: 3000,
      });
      const payload: Payload = jwtDecode(action.payload);
      const user: IUser = payload.user;
      const exp: number = payload.exp;

      return {
        ...initialState,
        token: action.payload,
        user,
        exp,
      };
    case "SIGN_OUT":
      toast.success("Goodbye...", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return {
        ...initialState,
      };
      case "FOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followedIds: [ ...state.user?.followedIds || [], action.payload],
        },
      };
    case "UNFOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followedIds: state.user?.followedIds?.filter(
            (followedId) => followedId !== action.payload
          ),
        },
      };
    
    default:
      return state;
  }
};

export default authReducer;
