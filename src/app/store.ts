import {
  configureStore,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import currentUserReducer from "./slices/currentUserSlice";
import selectedUserReducer from "./slices/selectedUserSlice";
import postsReducer from "./slices/postsSlice";
import messengerReducer from "./slices/messengerSlice";
import searchReducer from "./slices/searchSlice";
import socketReducer from "./slices/socketSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    currentUserRelatives: currentUserReducer,
    selectedUserAndRelatives: selectedUserReducer,
    posts: postsReducer,
    messenger: messengerReducer,
    search: searchReducer,
    socket: socketReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
