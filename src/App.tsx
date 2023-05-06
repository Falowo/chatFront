import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import Signin from "./pages/signin/Signin";
import Home from "./pages/home/Home";
import SignUp from "./pages/register/Signup";
import Profile from "./pages/profile/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useAppSelector,
  useAppDispatch,
} from "./app/hooks";
// import useCookie from "react-use-cookie";
import {
  selectAuthUser,
  selectToken,
} from "./app/slices/authSlice";
import Search from "./pages/search/Search";
import {
  selectConnectedUsers,
  setConnectedUsers,
  socketAddUser,
} from "./app/slices/socketSlice";
import { socket } from "./config/config.socket";
import {
  addFriendAsync,
  addFriendRequestFromAsync,
  getCurrentUserAsync,
  getFriendRequestsFromAsync,
  getFriendsOfCurrentUserAsync,
  removeFriendAsync,
  selectCurrentUser,
  setFriendRequestsTo,
  setNotCheckedAcceptedFriendRequestsBy,
  setNotCheckedFriendRequests,
} from "./app/slices/currentUserSlice";
import {
  getConversationsAsync,
  getUncheckedByCurrentUserAsync,
  selectConversations,
} from "./app/slices/messengerSlice";
import useDeepCompareEffect from "use-deep-compare-effect";
import FriendRequests from "./pages/friendRequests/FriendRequests";
import {
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// const darkTheme = createTheme({
//   palette: {
//     mode: "dark",
//   },
// });
const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const App = () => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector(selectAuthUser);
  const token = useAppSelector(selectToken);
  const currentUser = useAppSelector(selectCurrentUser);
  const conversations = useAppSelector(selectConversations);
  const connectedUsers = useAppSelector(
    selectConnectedUsers,
  );
  const [conversationsIdsSet, setConversationsIdsSet] =
    useState<Set<string> | undefined>(undefined);
  const authToken = localStorage.getItem("token");

  useEffect(() => {
    if (!!authUser && !!authToken) {
      console.log({ authToken });
      dispatch(getCurrentUserAsync(authUser._id!));
    }
  }, [dispatch, authUser, authToken]);

  useEffect(() => {
    !!authUser &&
      !!authToken &&
      !!currentUser &&
      currentUser._id === authUser._id &&
      dispatch(getConversationsAsync());
  }, [authToken, authUser, currentUser, dispatch]);

  useEffect(() => {
    !!authUser &&
      !!authToken &&
      !!currentUser &&
      currentUser._id === authUser._id &&
      dispatch(socketAddUser(authUser._id!));
  }, [authToken, authUser, currentUser, dispatch]);

  useEffect(() => {
    !!authUser &&
      !!authToken &&
      !!currentUser &&
      currentUser._id === authUser._id &&
      dispatch(
        setNotCheckedFriendRequests({
          userIds:
            authUser?.notCheckedFriendRequestsFrom || [],
        }),
      );
  }, [authToken, authUser, currentUser, dispatch]);

  useEffect(() => {
    !!authUser &&
      !!authToken &&
      !!currentUser &&
      currentUser._id === authUser._id &&
      dispatch(
        setNotCheckedAcceptedFriendRequestsBy({
          userIds:
            currentUser?.notCheckedAcceptedFriendRequestsBy ||
            [],
        }),
      );
  }, [
    authToken,
    authUser,
    currentUser,
    currentUser?.notCheckedAcceptedFriendRequestsBy,
    dispatch,
  ]);
  useEffect(() => {
    !!authUser &&
      !!authToken &&
      !!currentUser &&
      currentUser._id === authUser._id &&
      dispatch(
        setFriendRequestsTo({
          userIds: currentUser?.friendRequestsTo || [],
        }),
      );
  }, [
    authToken,
    authUser,
    currentUser,
    currentUser?.friendRequestsTo,
    dispatch,
  ]);

  useEffect(() => {
    !!authUser &&
      !!authToken &&
      !!currentUser &&
      currentUser._id === authUser._id &&
      dispatch(getFriendsOfCurrentUserAsync(authUser._id!));
  }, [dispatch, authUser, authToken, currentUser]);

  useEffect(() => {
    !!authUser &&
      !!authToken &&
      !!currentUser &&
      currentUser._id === authUser._id &&
      dispatch(getFriendRequestsFromAsync());
  }, [dispatch, authUser, authToken, currentUser]);

  useEffect(() => {
    !!conversations &&
      !!conversations?.length &&
      !!authUser &&
      !!authToken &&
      !!currentUser &&
      currentUser._id === authUser._id &&
      setConversationsIdsSet(
        new Set(conversations?.map((c) => c._id!)),
      );
  }, [authToken, authUser, conversations, currentUser]);

  useDeepCompareEffect(() => {
    !!conversationsIdsSet &&
      !!authUser &&
      !!authToken &&
      !!currentUser &&
      currentUser._id === authUser._id &&
      dispatch(
        getUncheckedByCurrentUserAsync(conversationsIdsSet),
      );
  }, [conversationsIdsSet, dispatch]);

  useEffect(() => {
    !!authUser &&
      !!authToken &&
      !!currentUser &&
      currentUser._id === authUser._id &&
      socket?.on(
        "getUsers",
        (
          users: Array<{
            socketId: string;
            userId: string;
          }>,
        ) => {
          dispatch(setConnectedUsers(users));
        },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id]);

  useEffect(() => {
    !!authUser &&
      !!authToken &&
      !!currentUser &&
      currentUser._id === authUser._id &&
      socket?.on("getFriendRequest", (senderId: string) => {
        dispatch(addFriendRequestFromAsync(senderId));
      });
  }, [dispatch, authUser, authToken, currentUser]);

  useEffect(() => {
    !!authUser &&
      !!authToken &&
      !!currentUser &&
      currentUser._id === authUser._id &&
      socket?.on(
        "acceptedFriendRequest",
        (senderId: string) => {
          dispatch(addFriendAsync({ userId: senderId }));
        },
      );
  }, [dispatch, authUser, authToken, currentUser]);
  useEffect(() => {
    !!authUser &&
      !!authToken &&
      !!currentUser &&
      currentUser._id === authUser._id &&
      socket?.on(
        "declinedFriendRequest",
        (senderId: string) => {
          dispatch(removeFriendAsync({ userId: senderId }));
        },
      );
  }, [dispatch, authUser, authToken, currentUser]);

  useEffect(() => {
    console.log({ connectedUsers });
    console.log({ authToken });
  }, [authToken, connectedUsers]);

  useEffect(() => {
    !!token && localStorage.setItem("token", token);
  }, [token]);

  // useEffect(() => {
  //   console.log(process.env.NODE_ENV);
  //   console.log(process.env.REACT_APP_PUBLIC_FOLDER);
  //   console.log(process.env.REACT_APP_API_URL);
  //   console.log(process.env.REACT_APP_SOCKET_URL);
  // }, []);

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <ToastContainer />
        <Routes>
          <Route
            path="/signin"
            element={!authUser ? <Signin /> : <Home />}
            // element={<Signin />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUp /> : <Home />}
          />
          <Route
            path="/messenger/:userId"
            element={!!authUser ? <Home /> : <Signin />}
          />
          <Route
            path="/messenger"
            element={!!authUser ? <Home /> : <Signin />}
          />
          <Route
            path="/profile/:username"
            element={!!authUser ? <Profile /> : <Signin />}
          />
          <Route
            path="/search"
            element={!!authUser ? <Search /> : <Signin />}
          />
          <Route
            path="/friend/requests"
            element={
              !!authUser ? <FriendRequests /> : <Signin />
            }
          />

          <Route
            path="/:userId"
            element={!!authUser ? <Home /> : <Signin />}
          />
          <Route
            path="*"
            element={!!authUser ? <Home /> : <Signin />}
          />
        </Routes>
      </Container>
    </ThemeProvider>
  );
};

export default App;
