import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import Home from "./pages/home/Home";
import Signin from "./pages/signin/Signin";
import SignUp from "./pages/register/Signup";
import Messenger from "./pages/messenger/Messenger";
import Profile from "./pages/profile/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useAppSelector,
  useAppDispatch,
} from "./app/hooks";
import useCookie from "react-use-cookie";
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
  addFriendRequestFromAsync,
  getCurrentUserAsync,
  getFriendRequestsFromAsync,
  getFriendsOfCurrentUserAsync,
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
import OponIfa from "./pages/oponIfa/OponIfa";
import {
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useAuth0 } from "@auth0/auth0-react";



const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
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
  const [authToken, setAuthToken] = useCookie("token", "");
  
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
  }, [
    connectedUsers,
    dispatch,
    authUser,
    authToken,
    currentUser,
  ]);

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
    console.log({ connectedUsers });
    console.log({ authToken });
  }, [authToken, connectedUsers]);

  useEffect(() => {
    !!token && setAuthToken(token);
  }, [setAuthToken, token]);


  useEffect(() => {
    isAuthenticated && (
      console.log({user})
      
    )
  }, [isAuthenticated, user]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container
        maxWidth="xl"
        style={{ backgroundColor: "black" }}
      >
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
            element={
              !!authUser ? <Messenger /> : <Signin />
            }
          />
          <Route
            path="/messenger"
            element={
              !!authUser ? <Messenger /> : <Signin />
            }
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
          <Route path="/ifaCity" element={<OponIfa />} />
          <Route
            path="/"
            element={!!authUser ? <Home /> : <Signin />}
          />
          <Route
            path="*"
            element={!!authUser ? <Home /> : <SignUp />}
          />
        </Routes>
      </Container>
    </ThemeProvider>
  );
};

export default App;
