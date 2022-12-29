import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { IPost } from "../../interfaces";
import {
  RootState,
  //  AppThunk
} from "../store";
import { toast } from "react-toastify";
import {
  createPost,
  getPostsByUserNameParams,
  getCurrentUserTimelinePosts,
  uploadFile,
  likePost,
  deletePost,
  updatePost,
} from "../../api/posts.api";
import { selectAuthUser, signoutAsync } from "./authSlice";

const position = {
  position: toast.POSITION.BOTTOM_RIGHT,
};

export interface CreatePostProps {
  currentUserId: string;
  desc: string;
  onTheWallOf?: string;
  file?: File;
}

export interface UpdatePostProps {
  newPost: IPost;
  file?: File;
}

export interface PostsState {
  timeline: IPost[];
  currentUserPosts: IPost[];
  selectedUserPosts: IPost[];
  isFetching: boolean;
  isEditing: boolean;
  isCreating: boolean;
  error: any;
  postEditing?: IPost | null;
}

const initialState: PostsState = {
  timeline: [],
  currentUserPosts: [],
  selectedUserPosts: [],
  isFetching: false,
  isEditing: false,
  isCreating: false,
  error: null,
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.

export const createPostAsync = createAsyncThunk(
  "posts/createPost",
  async (props: CreatePostProps) => {
    const { desc, file, currentUserId, onTheWallOf } =
      props;

    const newPost: IPost = {
      userId: currentUserId,
      onTheWallOf,
      desc,
    };

    if (!!file) {
      const data = new FormData();
      const fileName: string = `${Date.now()}${file.name}`;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      await uploadFile(data);
    }
    const res = await createPost({ ...newPost });
    const post: IPost = res.data;
    return post;
  },
);
export const updatePostAsync = createAsyncThunk(
  "posts/updatePost",
  async (props: UpdatePostProps) => {
    const { newPost, file } = props;

    if (!!file) {
      const data = new FormData();
      const fileName: string = `${Date.now()}${file.name}`;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      await uploadFile(data);
    }
    await updatePost(newPost);
    return newPost;
  },
);

export const deletePostAsync = createAsyncThunk(
  "posts/deletePost",
  async (postId: string) => {
    await deletePost(postId);
    return postId;
  },
);

export const getSelectedUserPostsAsync = createAsyncThunk(
  "posts/getSelectedUserPosts",
  async (selectedUserUsername: string) => {
    const response = await getPostsByUserNameParams(
      selectedUserUsername,
    );
    const posts: IPost[] = response.data;
    // The value we return becomes the `fulfilled` action payload
    return posts;
  },
);

export const getCurrentUserPostsAsync = createAsyncThunk(
  "posts/getCurrentUserPosts",
  async (currentUserUsername: string) => {
    const response = await getPostsByUserNameParams(
      currentUserUsername,
    );
    const posts: IPost[] = response.data;
    // The value we return becomes the `fulfilled` action payload
    return posts;
  },
);

export const getTimelineAsync = createAsyncThunk(
  "posts/getTimeline",
  async () => {
    const response = await getCurrentUserTimelinePosts();

    const posts: IPost[] = response.data;
    // The value we return becomes the `fulfilled` action payload

    return posts;
  },
);
export const likePostAsync = createAsyncThunk<
  {
    postId: string;
    currentUserId: string;
  },
  string,
  { state: RootState }
>(
  "posts/likePost",
  async (postId: string, { getState }) => {
    await likePost(postId);

    // The value we return becomes the `fulfilled` action payload
    const authUser = selectAuthUser(getState());
    const currentUserId: string = authUser?._id!;

    return { postId, currentUserId };
  },
);

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setIsCreating: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.isCreating = action.payload;
    },
    setIsEditing: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.isEditing = action.payload;
    },
    setPostEditing: (
      state,
      action: PayloadAction<IPost | null>,
    ) => {
      state.postEditing = action.payload;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(createPostAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(
        createPostAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          if (!!action.payload) {
            state.currentUserPosts = [
              action.payload,
              ...state.currentUserPosts,
            ];
            state.timeline = [
              action.payload,
              ...state.timeline,
            ];
            if (action.payload.onTheWallOf) {
              state.selectedUserPosts = [
                action.payload,
                ...state.selectedUserPosts,
              ];
            }
          }
        },
      )
      .addCase(
        createPostAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(updatePostAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(
        updatePostAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          if (!!action.payload) {
            const newPost = action.payload;
            state.currentUserPosts =
              state.currentUserPosts.map((p) => {
                if (p._id === newPost._id) {
                  return newPost;
                } else return p;
              });
            state.timeline = state.timeline.map((p) => {
              if (p._id === newPost._id) {
                return newPost;
              } else return p;
            });

            if (!!action.payload.onTheWallOf) {
              state.selectedUserPosts =
                state.selectedUserPosts.map((p) => {
                  if (p._id === newPost._id) {
                    return newPost;
                  } else return p;
                });
            }
          }
        },
      )
      .addCase(
        updatePostAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(
        getSelectedUserPostsAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        getSelectedUserPostsAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          if (!!action.payload) {
            state.selectedUserPosts = action.payload;
          }
        },
      )
      .addCase(
        getSelectedUserPostsAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(getTimelineAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(
        getTimelineAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          if (!!action.payload) {
            state.timeline = action.payload;
          }
        },
      )
      .addCase(
        getTimelineAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(likePostAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(likePostAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        if (!!action.payload) {
          const { postId, currentUserId } = action.payload;
          const post = state.timeline.find(
            (p) => p._id === postId,
          );
          if (!!post) {
            const likersId = post.likersId;
            if (!!likersId?.includes(currentUserId)) {
              state.timeline = state.timeline.map((p) => {
                if (p._id === postId) {
                  return {
                    ...p,
                    likersId: likersId.filter(
                      (lId) => lId !== currentUserId,
                    ),
                  };
                } else {
                  return { ...p };
                }
              });
            } else {
              state.timeline = state.timeline.map((p) => {
                if (p._id === postId) {
                  return {
                    ...p,
                    likersId: [
                      ...(likersId || []),
                      currentUserId,
                    ],
                  };
                } else {
                  return { ...p };
                }
              });
            }
          }
        }
      })
      .addCase(likePostAsync.rejected, (state, action) => {
        state.isFetching = false;
        toast(action.error.message, position);
      })
      .addCase(
        getCurrentUserPostsAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        getCurrentUserPostsAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          if (!!action.payload) {
            state.currentUserPosts = action.payload;
          }
        },
      )
      .addCase(
        getCurrentUserPostsAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(signoutAsync.fulfilled, (state) => {
        state.timeline = [];
        state.currentUserPosts = [];
        state.selectedUserPosts = [];
        state.isFetching = false;
        state.error = null;
      });
  },
});

export const {
  setIsCreating,
  setIsEditing,
  setPostEditing,
} = postsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export const selectCurrentUserPosts = (state: RootState) =>
  state.posts.currentUserPosts;
export const selectSelectedUserPosts = (state: RootState) =>
  state.posts.selectedUserPosts;
export const selectTimeline = (state: RootState) =>
  state.posts.timeline;
export const selectIsCreating = (state: RootState) =>
  state.posts.isCreating;
export const selectIsEditing = (state: RootState) =>
  state.posts.isEditing;
export const selectPostEditing = (state: RootState) =>
  state.posts.postEditing;
export const selectIsFetchingPosts = (state: RootState) =>
  state.posts.isFetching;

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

export default postsSlice.reducer;
