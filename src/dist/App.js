"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var material_1 = require("@mui/material");
var Home_1 = require("./pages/home/Home");
var Signin_1 = require("./pages/signin/Signin");
var Signup_1 = require("./pages/register/Signup");
var Messenger_1 = require("./pages/messenger/Messenger");
var Profile_1 = require("./pages/profile/Profile");
var react_toastify_1 = require("react-toastify");
require("react-toastify/dist/ReactToastify.css");
var hooks_1 = require("./app/hooks");
var react_use_cookie_1 = require("react-use-cookie");
var authSlice_1 = require("./app/slices/authSlice");
var Search_1 = require("./pages/search/Search");
var socketSlice_1 = require("./app/slices/socketSlice");
var config_socket_1 = require("./config/config.socket");
var currentUserSlice_1 = require("./app/slices/currentUserSlice");
var messengerSlice_1 = require("./app/slices/messengerSlice");
var use_deep_compare_effect_1 = require("use-deep-compare-effect");
var FriendRequests_1 = require("./pages/friendRequests/FriendRequests");
var OponIfa_1 = require("./pages/oponIfa/OponIfa");
var styles_1 = require("@mui/material/styles");
var CssBaseline_1 = require("@mui/material/CssBaseline");
var auth0_react_1 = require("@auth0/auth0-react");
var darkTheme = styles_1.createTheme({
    palette: {
        mode: "dark"
    }
});
var App = function () {
    var _a = auth0_react_1.useAuth0(), user = _a.user, isAuthenticated = _a.isAuthenticated, isLoading = _a.isLoading;
    var dispatch = hooks_1.useAppDispatch();
    var authUser = hooks_1.useAppSelector(authSlice_1.selectAuthUser);
    var token = hooks_1.useAppSelector(authSlice_1.selectToken);
    var currentUser = hooks_1.useAppSelector(currentUserSlice_1.selectCurrentUser);
    var conversations = hooks_1.useAppSelector(messengerSlice_1.selectConversations);
    var connectedUsers = hooks_1.useAppSelector(socketSlice_1.selectConnectedUsers);
    var _b = react_1.useState(undefined), conversationsIdsSet = _b[0], setConversationsIdsSet = _b[1];
    var _c = react_use_cookie_1["default"]("token", ""), authToken = _c[0], setAuthToken = _c[1];
    react_1.useEffect(function () {
        if ((!!authUser) && !!authToken) {
            console.log({ authToken: authToken });
            dispatch(currentUserSlice_1.getCurrentUserAsync(authUser._id));
        }
    }, [dispatch, authUser, authToken]);
    react_1.useEffect(function () {
        !!authUser &&
            !!authToken &&
            !!currentUser &&
            currentUser._id === authUser._id &&
            dispatch(messengerSlice_1.getConversationsAsync());
    }, [authToken, authUser, currentUser, dispatch]);
    react_1.useEffect(function () {
        !!authUser &&
            !!authToken &&
            !!currentUser &&
            currentUser._id === authUser._id &&
            dispatch(socketSlice_1.socketAddUser(authUser._id));
    }, [authToken, authUser, currentUser, dispatch]);
    react_1.useEffect(function () {
        !!authUser &&
            !!authToken &&
            !!currentUser &&
            currentUser._id === authUser._id &&
            dispatch(currentUserSlice_1.setNotCheckedFriendRequests({
                userIds: (authUser === null || authUser === void 0 ? void 0 : authUser.notCheckedFriendRequestsFrom) || []
            }));
    }, [authToken, authUser, currentUser, dispatch]);
    react_1.useEffect(function () {
        !!authUser &&
            !!authToken &&
            !!currentUser &&
            currentUser._id === authUser._id &&
            dispatch(currentUserSlice_1.setNotCheckedAcceptedFriendRequestsBy({
                userIds: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.notCheckedAcceptedFriendRequestsBy) ||
                    []
            }));
    }, [
        authToken,
        authUser,
        currentUser,
        currentUser === null || currentUser === void 0 ? void 0 : currentUser.notCheckedAcceptedFriendRequestsBy,
        dispatch,
    ]);
    react_1.useEffect(function () {
        !!authUser &&
            !!authToken &&
            !!currentUser &&
            currentUser._id === authUser._id &&
            dispatch(currentUserSlice_1.setFriendRequestsTo({
                userIds: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.friendRequestsTo) || []
            }));
    }, [
        authToken,
        authUser,
        currentUser,
        currentUser === null || currentUser === void 0 ? void 0 : currentUser.friendRequestsTo,
        dispatch,
    ]);
    react_1.useEffect(function () {
        !!authUser &&
            !!authToken &&
            !!currentUser &&
            currentUser._id === authUser._id &&
            dispatch(currentUserSlice_1.getFriendsOfCurrentUserAsync(authUser._id));
    }, [dispatch, authUser, authToken, currentUser]);
    react_1.useEffect(function () {
        !!authUser &&
            !!authToken &&
            !!currentUser &&
            currentUser._id === authUser._id &&
            dispatch(currentUserSlice_1.getFriendRequestsFromAsync());
    }, [dispatch, authUser, authToken, currentUser]);
    react_1.useEffect(function () {
        !!conversations &&
            !!(conversations === null || conversations === void 0 ? void 0 : conversations.length) &&
            !!authUser &&
            !!authToken &&
            !!currentUser &&
            currentUser._id === authUser._id &&
            setConversationsIdsSet(new Set(conversations === null || conversations === void 0 ? void 0 : conversations.map(function (c) { return c._id; })));
    }, [authToken, authUser, conversations, currentUser]);
    use_deep_compare_effect_1["default"](function () {
        !!conversationsIdsSet &&
            !!authUser &&
            !!authToken &&
            !!currentUser &&
            currentUser._id === authUser._id &&
            dispatch(messengerSlice_1.getUncheckedByCurrentUserAsync(conversationsIdsSet));
    }, [conversationsIdsSet, dispatch]);
    react_1.useEffect(function () {
        !!authUser &&
            !!authToken &&
            !!currentUser &&
            currentUser._id === authUser._id && (config_socket_1.socket === null || config_socket_1.socket === void 0 ? void 0 : config_socket_1.socket.on("getUsers", function (users) {
            dispatch(socketSlice_1.setConnectedUsers(users));
        }));
    }, [
        connectedUsers,
        dispatch,
        authUser,
        authToken,
        currentUser,
    ]);
    react_1.useEffect(function () {
        !!authUser &&
            !!authToken &&
            !!currentUser &&
            currentUser._id === authUser._id && (config_socket_1.socket === null || config_socket_1.socket === void 0 ? void 0 : config_socket_1.socket.on("getFriendRequest", function (senderId) {
            dispatch(currentUserSlice_1.addFriendRequestFromAsync(senderId));
        }));
    }, [dispatch, authUser, authToken, currentUser]);
    react_1.useEffect(function () {
        console.log({ connectedUsers: connectedUsers });
        console.log({ authToken: authToken });
    }, [authToken, connectedUsers]);
    react_1.useEffect(function () {
        !!token && setAuthToken(token);
    }, [setAuthToken, token]);
    react_1.useEffect(function () {
        isAuthenticated && (console.log({ user: user }));
    }, [isAuthenticated, user]);
    if (isLoading) {
        return react_1["default"].createElement("div", null, "Loading ...");
    }
    return (react_1["default"].createElement(styles_1.ThemeProvider, { theme: darkTheme },
        react_1["default"].createElement(CssBaseline_1["default"], null),
        react_1["default"].createElement(material_1.Container, { maxWidth: "xl", style: { backgroundColor: "black" } },
            react_1["default"].createElement(react_toastify_1.ToastContainer, null),
            react_1["default"].createElement(react_router_dom_1.Routes, null,
                react_1["default"].createElement(react_router_dom_1.Route, { path: "/signin", element: (!authUser && !isAuthenticated) ? react_1["default"].createElement(Signin_1["default"], null) : react_1["default"].createElement(Home_1["default"], null) }),
                react_1["default"].createElement(react_router_dom_1.Route, { path: "/signup", element: (!authUser && !isAuthenticated) ? react_1["default"].createElement(Signup_1["default"], null) : react_1["default"].createElement(Home_1["default"], null) }),
                react_1["default"].createElement(react_router_dom_1.Route, { path: "/messenger/:userId", element: (!!authUser || isAuthenticated) ? react_1["default"].createElement(Messenger_1["default"], null) : react_1["default"].createElement(Signin_1["default"], null) }),
                react_1["default"].createElement(react_router_dom_1.Route, { path: "/messenger", element: (!!authUser || isAuthenticated) ? react_1["default"].createElement(Messenger_1["default"], null) : react_1["default"].createElement(Signin_1["default"], null) }),
                react_1["default"].createElement(react_router_dom_1.Route, { path: "/profile/:username", element: (!!authUser || isAuthenticated) ? react_1["default"].createElement(Profile_1["default"], null) : react_1["default"].createElement(Signin_1["default"], null) }),
                react_1["default"].createElement(react_router_dom_1.Route, { path: "/search", element: (!!authUser || isAuthenticated) ? react_1["default"].createElement(Search_1["default"], null) : react_1["default"].createElement(Signin_1["default"], null) }),
                react_1["default"].createElement(react_router_dom_1.Route, { path: "/friend/requests", element: (!!authUser || isAuthenticated) ? react_1["default"].createElement(FriendRequests_1["default"], null) : react_1["default"].createElement(Signin_1["default"], null) }),
                react_1["default"].createElement(react_router_dom_1.Route, { path: "/ifaCity", element: react_1["default"].createElement(OponIfa_1["default"], null) }),
                react_1["default"].createElement(react_router_dom_1.Route, { path: "/", element: (!!authUser || isAuthenticated) ? react_1["default"].createElement(Home_1["default"], null) : react_1["default"].createElement(Signin_1["default"], null) }),
                react_1["default"].createElement(react_router_dom_1.Route, { path: "*", element: (!!authUser || isAuthenticated) ? react_1["default"].createElement(Home_1["default"], null) : react_1["default"].createElement(Signup_1["default"], null) })))));
};
exports["default"] = App;
