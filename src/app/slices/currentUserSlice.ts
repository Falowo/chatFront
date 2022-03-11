import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { IUser } from "../../interfaces";
import {
  RootState,
  //  AppThunk
} from "../store";
import { toast } from "react-toastify";
import {
  addFriend,
  followUser,
  getBestCurrentUserFriends,
  getFollowedUsersByUserIdParams,
  getFollowersByUserIdParams,
  getFriendsByUserIdParams,
  getUserByUserIdQuery,
  sendFriendRequest,
  unfollowUser,
} from "../../api/users.api";
import { socketSendFriendRequest } from "./socketSlice";

const position = {
  position: toast.POSITION.BOTTOM_RIGHT,
};

interface FollowProps {
  userId: string;
}

export interface CurrentUserState {
  followedByCurrentUser: IUser[];
  followersOfCurrentUser: string[];
  friendsOfCurrentUser: IUser[];
  bestFriendsOfCurrentUser: {
    friendId: string;
    numberOfMessages: number;
  }[];
  friendRequestsTo: string[];
  friendRequestsFrom: string[];
  notCheckedFriendRequests?: string[];
  isFetching: boolean;
  error: any;
}

const initialState: CurrentUserState = {
  followedByCurrentUser: [],
  followersOfCurrentUser: [],
  friendsOfCurrentUser: [],
  bestFriendsOfCurrentUser: [],
  friendRequestsTo: [],
  friendRequestsFrom: [],
  notCheckedFriendRequests: [],
  isFetching: false,
  error: null,
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const getFriendsOfCurrentUserAsync =
  createAsyncThunk(
    "currentUser/getFriendsOfCurrentUser",
    async (currentUserId: string, { dispatch }) => {
      const response = await getFriendsByUserIdParams(
        currentUserId,
      );

      const friendsOfCurrentUser: IUser[] = response.data;
      // The value we return becomes the `fulfilled` action payload
      dispatch(getBestFriendsOfCurrentUserAsync());
      return friendsOfCurrentUser;
    },
  );

export const getBestFriendsOfCurrentUserAsync =
  createAsyncThunk(
    "currentUser/getBestFriendsOfCurrentUser",
    async () => {
      const response = await getBestCurrentUserFriends();

      const bestFriendsOfCurrentUser: {
        friendId: string;
        numberOfMessages: number;
      }[] = response.data;
      // The value we return becomes the `fulfilled` action payload
      return bestFriendsOfCurrentUser;
    },
  );

export const getFollowersOfCurrentUserAsync =
  createAsyncThunk(
    "currentUser/getFollowersOfCurrentUser",
    async (currentUserId: string) => {
      const response = await getFollowersByUserIdParams(
        currentUserId,
      );
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    },
  );
export const getFollowedByCurrentUserAsync =
  createAsyncThunk(
    "currentUser/getFollowedByCurrentUser",
    async (currentUserId: string) => {
      const response = await getFollowedUsersByUserIdParams(
        currentUserId,
      );
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    },
  );

export const followUserAsync = createAsyncThunk(
  "currentUser/followUser",
  async (props: FollowProps) => {
    const { userId } = props;

    await followUser(userId);
    // The value we return becomes the `fulfilled` action payload

    const res = await getUserByUserIdQuery(userId);
    const user: IUser = res.data._doc;

    return user;
  },
);
export const unfollowUserAsync = createAsyncThunk(
  "currentUser/unfollowUser",
  async (props: FollowProps) => {
    const { userId } = props;

    await unfollowUser(userId);
    // The value we return becomes the `fulfilled` action payload
    return userId;
  },
);

export const addFriendAsync = createAsyncThunk(
  "currentUser/addFriend",
  async (props: FollowProps) => {
    const { userId } = props;

    await addFriend(userId);
    // The value we return becomes the `fulfilled` action payload

    const res = await getUserByUserIdQuery(userId);
    const user: IUser = res.data._doc;

    return user;
  },
);

export const sendFriendRequestAsync = createAsyncThunk(
  "currentUser/sendFriendRequest",
  async (userId: string, { dispatch }) => {
    const res = await sendFriendRequest(userId);
    const props: {
      updatedUser: IUser;
      updatedCurrentUser: IUser;
    } = res.data;

    !!props.updatedCurrentUser &&
      dispatch(
        socketSendFriendRequest({
          userId,
          currentUserId: props.updatedCurrentUser._id!,
        }),
      );
    return props;
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

      state.notCheckedFriendRequests = userIds;
    },
    addFriendRequestFrom: (
      state,
      action: PayloadAction<{ userId: string }>,
    ) => {
      const { userId } = action.payload;

      state.notCheckedFriendRequests = [
        ...(state.notCheckedFriendRequests?.filter(
          (uId) => uId !== userId,
        ) || []),
        userId,
      ];
      state.friendRequestsFrom = [
        ...state.friendRequestsFrom?.filter(
          (fId) => fId !== userId,
        ),
        userId,
      ];
    },
    removeFriendRequest: (
      state,
      action: PayloadAction<{ userId: string }>,
    ) => {
      const { userId } = action.payload;

      state.notCheckedFriendRequests = [
        ...(state.notCheckedFriendRequests?.filter(
          (uId) => uId !== userId,
        ) || []),
      ];
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
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
          if (!!action.payload) {
            state.friendsOfCurrentUser = action.payload;
          }
        },
      )
      .addCase(
        getFriendsOfCurrentUserAsync.rejected,
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
          const { updatedUser, updatedCurrentUser } =
            action.payload;
          state.isFetching = false;
          state.friendRequestsTo = [
            ...(state.friendRequestsTo?.filter(
              (frId) => frId !== updatedUser._id!,
            ) || []),
            updatedUser?._id!,
          ];
          if (
            updatedCurrentUser.friends?.includes(
              updatedUser._id!,
            ) &&
            !state.friendsOfCurrentUser?.find(
              (f) => f._id! === updatedUser._id!,
            )
          ) {
            state.friendsOfCurrentUser = [
              ...(state.friendsOfCurrentUser || []),
              updatedUser,
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
        getBestFriendsOfCurrentUserAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        getBestFriendsOfCurrentUserAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          const bestFriendsOfCurrentUser: {
            friendId: string;
            numberOfMessages: number;
          }[] = action.payload;
          
          state.bestFriendsOfCurrentUser =
            bestFriendsOfCurrentUser;

          state.friendsOfCurrentUser =
            state.friendsOfCurrentUser
              .map((f) => {
                if (
                  state.bestFriendsOfCurrentUser.find(
                    (b) => b.friendId === f._id!,
                  )
                ) {
                  return {
                    ...f,
                    numberOfMessages:
                      state.bestFriendsOfCurrentUser.find(
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
        },
      )
      .addCase(
        getBestFriendsOfCurrentUserAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(
        getFollowersOfCurrentUserAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        getFollowersOfCurrentUserAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          if (!!action.payload) {
            state.followersOfCurrentUser = action.payload;
          }
        },
      )
      .addCase(
        getFollowersOfCurrentUserAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(
        getFollowedByCurrentUserAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        getFollowedByCurrentUserAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          if (!!action.payload) {
            state.followedByCurrentUser = action.payload;
          }
        },
      )
      .addCase(
        getFollowedByCurrentUserAsync.rejected,
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
            state.friendsOfCurrentUser = [
              ...state.friendsOfCurrentUser,
              action.payload,
            ];
          }
        },
      )
      .addCase(addFriendAsync.rejected, (state, action) => {
        state.isFetching = false;
        toast(action.error.message, position);
      })
      .addCase(followUserAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(
        followUserAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          if (!!action.payload) {
            state.followedByCurrentUser = [
              ...state.followedByCurrentUser,
              action.payload,
            ];
          }
        },
      )
      .addCase(
        followUserAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(unfollowUserAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(
        unfollowUserAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          if (!!action.payload) {
            state.followedByCurrentUser = [
              ...state.followedByCurrentUser,
            ].filter((f) => {
              return f._id !== action.payload;
            });
          }
        },
      )
      .addCase(
        unfollowUserAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      );
  },
});

export const {
  setNotCheckedFriendRequests,
  addFriendRequestFrom,
  removeFriendRequest,
} = currentUserSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCurrentUserRelatives = (
  state: RootState,
) => state.currentUserRelatives;

export const selectFollowedByCurrentUser = (
  state: RootState,
) => state.currentUserRelatives.followedByCurrentUser;

export const selectBestFriendsOfCurrentUser = (
  state: RootState,
) => state.currentUserRelatives.bestFriendsOfCurrentUser;

export const selectFriendsOfCurrentUser = (
  state: RootState,
) => state.currentUserRelatives.friendsOfCurrentUser;

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
