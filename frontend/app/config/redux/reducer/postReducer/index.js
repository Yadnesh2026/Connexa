import { createSlice } from "@reduxjs/toolkit";
import { reset } from "../authReducer";
import { getAllComments, getAllPosts, incrementLike } from "../../action/postAction";

const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  comments: [],
  postId: "",
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    setPostId: (state, action) => {
      state.postId = action.payload;
    },
    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.message = "Fecting all the post";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postFetched = true;
        state.posts = action.payload.posts.reverse();
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(incrementLike.fulfilled, (state, action) => {
        const post_id = action.meta.arg.post_id;
        const post = state.posts.find((p) => p._id === post_id);
        if (post) {
          post.likes = post.likes + 1;
        }
      })
      .addCase(getAllComments.fulfilled,(state,action)=>{
        state.postId = action.payload.post_id
        state.comments = action.payload.comments
        console.log(state.comments)
      })
  },
});


export const { setPostId, resetPostId } = postSlice.actions;

export default postSlice.reducer;
