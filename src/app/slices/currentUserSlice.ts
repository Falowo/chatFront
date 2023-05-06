import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import {
  IUser,
  ToUpdateUserDesc,
  ToUpdateUserInfo,
} from "../../interfaces";
import {
  RootState,
  //  AppThunk
} from "../store";
import { toast } from "react-toastify";
import {
  acceptFriendRequest,
  addFriend,
  checkAcceptedFriendRequests,
  checkFriendRequests,
  declineFriendRequest,
  editCoverPicture,
  editProfilePicture,
  getBestCurrentUserFriends,
  getFriendRequestsFrom,
  getFriendsByUserIdParams,
  getUserByUserIdQuery,
  removeFriend,
  sendFriendRequest,
  updateCurrentUserDesc,
  updateCurrentUserInfo,
} from "../../api/users.api";
import {
  socketAcceptFriendRequest,
  socketSendFriendRequest,
} from "./socketSlice";
import { uploadFile } from "../../api/files.api";
import { signoutAsync } from "./authSlice";

const position = {
  position: toast.POSITION.BOTTOM_RIGHT,
};

interface BestFriendOfCurrentUser {
  friendId: string;
  numberOfMessages: number;
}

export interface CurrentUserState {
  currentUser?: IUser;
  friends: IUser[];
  bestFriends: BestFriendOfCurrentUser[];
  friendRequestsTo: string[];
  friendRequestsFrom: IUser[];
  notCheckedFriendRequestsFrom: string[];
  notCheckedAcceptedFriendRequestsBy: string[];
  isFetching: boolean;
  editInfoMode: boolean;
  editDescMode: boolean;
  error: any;
}

const initialState: CurrentUserState = {
  currentUser: undefined,
  friends: [],
  bestFriends: [],
  friendRequestsTo: [],
  friendRequestsFrom: [],
  notCheckedFriendRequestsFrom: [],
  notCheckedAcceptedFriendRequestsBy: [],
  isFetching: false,
  editInfoMode: false,
  editDescMode: false,
  error: null,
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.

export const getCurrentUserAsync = createAsyncThunk<
  IUser,
  string
>(
  "currentUser/getCurrentUserAsync",
  async (currentUserId) => {
    const res = await getUserByUserIdQuery(currentUserId);
    const currentUser = res.data._doc;
    return currentUser;
  },
);
export const updateCurrentUserInfoAsync = createAsyncThunk<
  IUser,
  ToUpdateUserInfo
>(
  "currentUser/updateCurrentUserInfoAsync",
  async (toUpdateUserInfo) => {
    const res = await updateCurrentUserInfo(
      toUpdateUserInfo,
    );
    const currentUser = res.data;
    return currentUser;
  },
);
export const updateCurrentUserDescAsync = createAsyncThunk<
  IUser,
  ToUpdateUserDesc
>(
  "currentUser/updateCurrentUserDescAsync",
  async (toUpdateUserDesc) => {
    const res = await updateCurrentUserDesc(
      toUpdateUserDesc,
    );
    const currentUser = res.data;
    return currentUser;
  },
);

export const setProfilePictureAsync = createAsyncThunk(
  "currentUser/setProfilePictureAsync",
  async (file: File) => {
    const data = new FormData();
    const fileName: string = `${Date.now()}${file.name}`;
    data.append("name", fileName);
    data.append("file", file);
    await uploadFile(data);

    const res = await editProfilePicture(fileName);
    const currentUser: IUser = res.data;
    return currentUser;
    // window.location.reload();
  },
);
export const setCoverPictureAsync = createAsyncThunk(
  "currentUser/setCoverPictureAsync",
  async (file: File) => {
    const data = new FormData();
    const fileName: string = `${Date.now()}${file.name}`;
    data.append("name", fileName);
    data.append("file", file);
    await uploadFile(data);

    const res = await editCoverPicture(fileName);
    const currentUser: IUser = res.data;
    return currentUser;
    // window.location.reload();
  },
);

export const getFriendsOfCurrentUserAsync =
  createAsyncThunk<
    // Return type of the payload creator
    IUser[],
    // First argument to the payload creator
    string,
    {
      // Optional fields for defining thunkApi field types
      dispatch: ThunkDispatch<unknown, unknown, AnyAction>;
      // state: RootState;
    }
  >(
    "currentUser/getFriendsOfCurrentUserAsync",
    async (currentUserId, { dispatch }) => {
      const response = await getFriendsByUserIdParams(
        currentUserId,
      );

      const friends: IUser[] = response.data;

      dispatch(getBestFriendsOfCurrentUserAsync(friends));

      return friends;
    },
  );

export const getBestFriendsOfCurrentUserAsync =
  createAsyncThunk(
    "currentUser/getBestFriendsOfCurrentUserAsync",
    async (friends: IUser[]) => {
      const response = await getBestCurrentUserFriends();

      const bestFriends: {
        friendId: string;
        numberOfMessages: number;
      }[] = response.data;
      // The value we return becomes the `fulfilled` action payload
      return {
        bestFriends,
        friends,
      };
    },
  );

export const addFriendAsync = createAsyncThunk(
  "currentUser/addFriendAsync",
  async ({ userId }: { userId: string }) => {
    await addFriend(userId);
    // The value we return becomes the `fulfilled` action payload

    const res = await getUserByUserIdQuery(userId);
    const user: IUser = res.data._doc;

    return user;
  },
);
export const removeFriendAsync = createAsyncThunk(
  "currentUser/removeFriendAsync",
  async ({ userId }: { userId: string }) => {
    const res = await removeFriend(userId);

    const { exFriend, currentUser } = await res.data;

    return { exFriend, currentUser };
  },
);

export const getFriendRequestsFromAsync = createAsyncThunk<
  IUser[]
>("currentUser/getFriendRequestsFromAsync", async () => {
  const response = await getFriendRequestsFrom();
  const users: IUser[] = response.data;
  // The value we return becomes the `fulfilled` action payload
  return users;
});

export const sendFriendRequestAsync = createAsyncThunk<
  {
    user: IUser;
    currentUser: IUser;
  },
  string,
  { dispatch: ThunkDispatch<unknown, unknown, AnyAction> }
>(
  "currentUser/sendFriendRequestAsync",
  async (userId: string, { dispatch }) => {
    const res = await sendFriendRequest(userId);
    const props: {
      user: IUser;
      currentUser: IUser;
    } = await res.data;

    !!props.currentUser &&
      dispatch(
        socketSendFriendRequest({
          userId,
          currentUserId: props.currentUser._id!,
        }),
      );
    return props;
  },
);

export const acceptFriendRequestAsync = createAsyncThunk<
  {
    user: IUser;
    currentUser: IUser;
  },
  string,
  { dispatch: ThunkDispatch<unknown, unknown, AnyAction> }
>(
  "currentUser/acceptFriendRequestAsync",
  async (userId: string, { dispatch }) => {
    const res = await acceptFriendRequest(userId);
    const props: {
      user: IUser;
      currentUser: IUser;
    } = res.data;

    !!props.currentUser &&
      dispatch(
        socketAcceptFriendRequest({
          userId,
          currentUserId: props.currentUser._id!,
        }),
      );
    return props;
  },
);

export const declineFriendRequestAsync = createAsyncThunk<
  {
    user: IUser;
    currentUser: IUser;
  },
  string,
  { dispatch: ThunkDispatch<unknown, unknown, AnyAction> }
>(
  "currentUser/declineFriendRequestAsync",
  async (userId: string, { dispatch }) => {
    const res = await declineFriendRequest(userId);
    const props: {
      user: IUser;
      currentUser: IUser;
    } = res.data;

    return props;
  },
);

export const checkFriendRequestsAsync = createAsyncThunk(
  "currentUser/checkFriendRequestsAsync",
  async () => {
    await checkFriendRequests();
    return true;
  },
);
export const checkAcceptedFriendRequestsAsync =
  createAsyncThunk(
    "currentUser/checkAcceptedFriendRequestsAsync",
    async () => {
      await checkAcceptedFriendRequests();
      return true;
    },
  );

export const addFriendRequestFromAsync = createAsyncThunk(
  "currentUser/addFriendRequestFromAsync",
  async (userId: string) => {
    console.log(userId);

    const res = await getUserByUserIdQuery(userId);
    const user: IUser = res.data._doc;

    return user;
  },
);

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setNotCheckedFriendRequests: (
      state,
      action: PayloadAction<{ userIds: string[] }>,
    ) => {
      const { userIds } = action.payload;
      state.notCheckedFriendRequestsFrom = userIds;
    },
    setNotCheckedAcceptedFriendRequestsBy: (
      state,
      action: PayloadAction<{ userIds: string[] }>,
    ) => {
      const { userIds } = action.payload;
      state.notCheckedAcceptedFriendRequestsBy = userIds;
    },
    setFriendRequestsTo: (
      state,
      action: PayloadAction<{ userIds: string[] }>,
    ) => {
      const { userIds } = action.payload;

      state.friendRequestsTo = userIds;
    },
    setEditInfoMode: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.editInfoMode = action.payload;
    },
    setEditDescMode: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.editDescMode = action.payload;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUserAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(
        getCurrentUserAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          const currentUser = action.payload;
          state.currentUser = currentUser;
        },
      )
      .addCase(
        getCurrentUserAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(setProfilePictureAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(
        setProfilePictureAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          const currentUser = action.payload;
          if (!!state.currentUser) {
            state.currentUser = {
              ...state.currentUser,
              profilePicture: currentUser.profilePicture!,
            };
          } else {
            state.currentUser = currentUser;
          }
        },
      )
      .addCase(
        setProfilePictureAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )

      .addCase(setCoverPictureAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(
        setCoverPictureAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          const currentUser = action.payload;
          if (!!state.currentUser) {
            state.currentUser = {
              ...state.currentUser,
              coverPicture: currentUser.coverPicture!,
            };
          } else {
            state.currentUser = currentUser;
          }
        },
      )
      .addCase(
        setCoverPictureAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )

      .addCase(sendFriendRequestAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(
        sendFriendRequestAsync.fulfilled,
        (state, action) => {
          const { user, currentUser } = action.payload;
          state.isFetching = false;
          if (!!user && !!currentUser) {
            state.friendRequestsTo = [
              ...(state.friendRequestsTo || []),
              user._id!,
            ];
          }
        },
      )
      .addCase(
        sendFriendRequestAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(
        acceptFriendRequestAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        acceptFriendRequestAsync.fulfilled,
        (state, action) => {
          const { user, currentUser } = action.payload;
          state.isFetching = false;
          if (!!user && !!currentUser) {
            state.friends = [
              ...(state.friends || []),
              user,
            ];
            state.friendRequestsFrom =
              state.friendRequestsFrom?.filter(
                (f) => f._id !== user._id!,
              );
          }
        },
      )
      .addCase(
        acceptFriendRequestAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(
        declineFriendRequestAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        declineFriendRequestAsync.fulfilled,
        (state, action) => {
          const { user } = action.payload;
          state.isFetching = false;

          state.friendRequestsFrom =
            state.friendRequestsFrom?.filter(
              (f) => f._id !== user._id!,
            );
        },
      )
      .addCase(
        declineFriendRequestAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(
        getFriendsOfCurrentUserAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        getFriendsOfCurrentUserAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
        },
      )
      .addCase(
        getFriendsOfCurrentUserAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(
        getBestFriendsOfCurrentUserAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        getBestFriendsOfCurrentUserAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          const { bestFriends, friends } = action.payload;

          if (!!bestFriends) {
            state.bestFriends = bestFriends;
          }
          if (!!friends && !!bestFriends) {
            state.friends = friends
              .map((f) => {
                if (
                  state.bestFriends.find(
                    (b) => b.friendId === f._id!,
                  )
                ) {
                  return {
                    ...f,
                    numberOfMessages:
                      state.bestFriends.find(
                        (b) => b.friendId === f._id!,
                      )?.numberOfMessages,
                  };
                } else {
                  return { ...f, numberOfMessages: 0 };
                }
              })
              .sort((a, b) => {
                return (
                  b.numberOfMessages! - a.numberOfMessages!
                );
              });
          }
        },
      )
      .addCase(
        getBestFriendsOfCurrentUserAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )

      .addCase(addFriendAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(
        addFriendAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          if (!!action.payload) {
            state.friends = [
              ...state.friends.filter(
                (f) => f._id !== action.payload._id,
              ),
              action.payload,
            ];
            console.log(state.friends, action.payload);
          }
        },
      )
      .addCase(addFriendAsync.rejected, (state, action) => {
        state.isFetching = false;
        toast(action.error.message, position);
      })

      .addCase(removeFriendAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(
        removeFriendAsync.fulfilled,
        (state, action) => {
          const {
            exFriend,
            currentUser,
          }: { exFriend: IUser; currentUser: IUser } =
            action.payload;
          state.isFetching = false;
          if (!!exFriend && !!currentUser) {
            state.friends = state.friends.filter(
              (f) => f._id !== exFriend._id,
            );
          }

          console.log(state.friends);
        },
      )
      .addCase(
        removeFriendAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )

      .addCase(
        checkFriendRequestsAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        checkFriendRequestsAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          if (!!action.payload) {
            state.notCheckedFriendRequestsFrom = [];
          }
        },
      )
      .addCase(
        checkFriendRequestsAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(
        checkAcceptedFriendRequestsAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        checkAcceptedFriendRequestsAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          if (!!action.payload) {
            state.notCheckedAcceptedFriendRequestsBy = [];
          }
        },
      )
      .addCase(
        checkAcceptedFriendRequestsAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(
        getFriendRequestsFromAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        getFriendRequestsFromAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          state.friendRequestsFrom = action.payload || [];
        },
      )
      .addCase(
        getFriendRequestsFromAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(
        updateCurrentUserInfoAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        updateCurrentUserInfoAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          const { city, from, relationship } =
            action.payload;
          if (!!state.currentUser) {
            state.currentUser = {
              ...state.currentUser,
              city,
              from,
              relationship,
            };
          }
        },
      )
      .addCase(
        updateCurrentUserInfoAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(
        updateCurrentUserDescAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        updateCurrentUserDescAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          const { desc } = action.payload;
          if (!!state.currentUser) {
            state.currentUser = {
              ...state.currentUser,
              desc,
            };
          }
        },
      )
      .addCase(
        updateCurrentUserDescAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(
        addFriendRequestFromAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        addFriendRequestFromAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          if (!!action.payload) {
            const user = action.payload;
            if (
              state.friendRequestsTo.includes(user._id!)
            ) {
              state.friends = [
                user,
                ...state.friends.filter(
                  (f) => f._id !== user._id,
                ),
              ];
              state.notCheckedAcceptedFriendRequestsBy = [
                ...state.notCheckedAcceptedFriendRequestsBy,
                user._id!,
              ];
              state.friendRequestsFrom =
                state.friendRequestsFrom.filter(
                  (f) => f._id! !== user._id,
                );
              state.friendRequestsTo =
                state.friendRequestsTo.filter(
                  (fId) => fId !== user._id,
                );
            } else {
              state.friendRequestsFrom = [
                user,
                ...state.friendRequestsFrom.filter(
                  (f) => f._id !== user._id,
                ),
              ];
              state.notCheckedFriendRequestsFrom = [
                ...state.notCheckedFriendRequestsFrom.filter(
                  (fId) => fId !== user._id!,
                ),
                user._id!,
              ];
            }
          }
        },
      )
      .addCase(
        addFriendRequestFromAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(signoutAsync.fulfilled, (state) => {
        state.currentUser = undefined;

        state.friends = [];
        state.bestFriends = [];
        state.friendRequestsTo = [];
        state.friendRequestsFrom = [];
        state.notCheckedFriendRequestsFrom = [];
        state.notCheckedAcceptedFriendRequestsBy = [];
        state.isFetching = false;
        state.editInfoMode = false;
        state.editDescMode = false;
        state.error = null;
      });
  },
});

export const {
  setNotCheckedFriendRequests,
  setNotCheckedAcceptedFriendRequestsBy,
  setFriendRequestsTo,
  setEditInfoMode,
  setEditDescMode,
} = currentUserSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export const selectCurrentUserRelatives = (
  state: RootState,
) => state.currentUserRelatives;

export const selectCurrentUser = (state: RootState) =>
  state.currentUserRelatives.currentUser;

export const selectBestFriendsOfCurrentUser = (
  state: RootState,
) => state.currentUserRelatives.bestFriends;

export const selectFriendsOfCurrentUser = (
  state: RootState,
) => state.currentUserRelatives.friends;

export const selectFriendRequestsFrom = (
  state: RootState,
) => state.currentUserRelatives.friendRequestsFrom;

export const selectFriendRequestsTo = (state: RootState) =>
  state.currentUserRelatives.friendRequestsTo;

export const selectNotCheckedFriendRequestsFrom = (
  state: RootState,
) =>
  state.currentUserRelatives.notCheckedFriendRequestsFrom;

export const selectNotCheckedAcceptedFriendRequestsBy = (
  state: RootState,
) =>
  state.currentUserRelatives
    .notCheckedAcceptedFriendRequestsBy;

export const selectEditInfoMode = (state: RootState) =>
  state.currentUserRelatives.editInfoMode;
export const selectEditDescMode = (state: RootState) =>
  state.currentUserRelatives.editDescMode;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState());
//     if (currentValue % 2 === 1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };

export default currentUserSlice.reducer;
