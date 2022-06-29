import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { IUser } from "../../interfaces";
import { RootState, AppThunk } from "../store";
import jwtDecode, { JwtPayload } from "jwt-decode";
import {
  IUserSigninCredentials,
  logout,
  refreshToken,
  signin,
  signup,
} from "../../api/auth.api";
import { toast } from "react-toastify";
import { AxiosResponse } from "axios";
import { getCookie, setCookie } from "react-use-cookie";
const position = {
  position: toast.POSITION.BOTTOM_RIGHT,
};
export interface Locals extends JwtPayload {
  user?: IUser;
  exp?: number;
  iat?: number;
}

export interface AuthState {
  token: string | null;
  locals?: Locals;
  isFetching: boolean;
  error: any;
  darkMode: boolean;
}

const initialState: AuthState = {
  token: getCookie("token"),
  locals: !!getCookie("token")
    ? jwtDecode(getCookie("token")!)
      ? jwtDecode(getCookie("token")!)
      : undefined
    : undefined,
  isFetching: false,
  error: false,
  darkMode: false,
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const signinAsync = createAsyncThunk(
  "auth/signin",
  async (creds: IUserSigninCredentials) => {
    const response = await signin(creds);
    // The value we return becomes the `fulfilled` action payload
    const token = response.data;
    await setCookie("token", token);
    return token;
  },
);
export const signoutAsync = createAsyncThunk(
  "auth/signout",
  async () => {
    // The value we return becomes the `fulfilled` action payload
    await logout();
    await localStorage.removeItem("token");
    return true;
  },
);
export const signupAsync = createAsyncThunk(
  "auth/signup",
  async (user: IUser) => {
    const response = await signup(user);
    // The value we return becomes the `fulfilled` action payload
    const token = response.data;
    await setCookie("token", token);
    toast(`Welcome ${user.username}`, position);
    return token;
  },
);
export const refreshTokenAsync = createAsyncThunk(
  "auth/refreshToken",
  async () => {
    const token = getCookie("token");
    let res: AxiosResponse<string, any>;
    if (!!token) {
      res = await refreshToken({ oldToken: token });
      return res.data;
    } else return null;
    // The value we return becomes the `fulfilled` action payload
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes

    // Use the PayloadAction type to declare the contents of `action.payload`
    toggleDarkMode: (
      state,
      action?: PayloadAction<boolean>,
    ) => {
      state.darkMode = action
        ? action.payload
        : !state.darkMode;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(signoutAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(signoutAsync.fulfilled, (state) => {
        state.isFetching = false;
        state.token = null;
        state.locals = undefined;

        toast(`We alleready  miss you`, position);
      })
      .addCase(signoutAsync.rejected, (state, action) => {
        state.isFetching = false;
        toast(action.error.message, position);
      })
      .addCase(signinAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(signinAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        if (typeof action.payload === "string") {
          state.token = action.payload;
          console.log({ token: state.token, action });

          try {
            const decodedToken: Locals | any = jwtDecode(
              action.payload,
            );
            if (!!decodedToken) {
              state.locals = {
                ...state.locals,
                user: decodedToken.user,
                exp: decodedToken.exp,
              };

              localStorage.setItem("token", action.payload);
              // console.log({ locals: state.locals });

              toast(
                `Welcome ${decodedToken.user.username}`,
                position,
              );
            }
          } catch (error: any) {
            console.log(error);
          }
        }
      })
      .addCase(signinAsync.rejected, (state, action) => {
        state.isFetching = false;
        state.token = null;
        toast(action.error.message, position);
      })
      .addCase(signupAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(signupAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        if (typeof action.payload === "string") {
          state.token = action.payload;
          try {
            const decodedToken: Locals | any = jwtDecode(
              action.payload,
            );
            if (decodedToken) {
              state.locals = {
                ...state.locals,
                user: decodedToken.user,
                exp: decodedToken.exp,
              };
              localStorage.setItem("token", action.payload);
            }
          } catch (error: any) {
            console.log(error);
            toast(error.response?.data, position);
          }
        }
      })
      .addCase(signupAsync.rejected, (state, action) => {
        state.isFetching = false;
        state.token = null;
        toast(action.error.message, position);
      })
      .addCase(refreshTokenAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(
        refreshTokenAsync.fulfilled,
        (state, action) => {
          console.log(action.type);
          console.log(action.payload);

          state.isFetching = false;
          if (typeof action.payload === "string") {
            try {
              const decodedToken: Locals | any = jwtDecode(
                action.payload,
              );
              if (decodedToken) {
                state.token = action.payload;
                state.locals = {
                  ...state.locals,
                  user: decodedToken.user,
                  exp: decodedToken.exp,
                };
                localStorage.setItem(
                  "token",
                  action.payload,
                );

                console.log({ locals: state.locals });

                toast(
                  `Your token has been succefully refreshed`,
                  position,
                );
              }
            } catch (error: any) {
              console.log(error);
              toast(error.response?.data, position);
            }
          } else if (action.payload === true) {
            toast(`Your token is valid`, position);
          }
        },
      )
      .addCase(
        refreshTokenAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          console.log(action.type);
          console.log(action.error);
          console.log(action);
          console.log({ token: state.token });
          console.log({ locals: state.locals });

          toast(action.error.message, position);
        },
      );
  },
});

export const { toggleDarkMode } = authSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectAuth = (state: RootState) => state.auth;
export const selectLocals = (state: RootState) =>
  state.auth.locals;
export const selectAuthUser = (state: RootState) =>
  state.auth.locals?.user;
export const selectExp = (state: RootState) =>
  state.auth.locals?.exp;

export const selectToken = (state: RootState) =>
  state.auth.token;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const checkExp =
  (): AppThunk => (dispatch, getState) => {
    const token = selectToken(getState());
    const exp = selectExp(getState());
    const nowInSec = Math.floor(Date.now() / 1000);
    if (!!exp && !!token && nowInSec < exp) {
      if (exp - nowInSec < 60 * 60 * 12) {
        console.log(nowInSec - exp);

        dispatch(refreshTokenAsync());
      }
    } else {
      console.log({ token, exp });
      console.log(
        `"now - exp": ${
          exp ? nowInSec - exp : "exp not defined"
        }`,
      );

      toast("logged out", position);

      dispatch(signoutAsync());
    }
  };

export default authSlice.reducer;
