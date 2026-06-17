import { clientServer } from '@/app/config'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async(_, ThunkAPI)=>{
        try{
            const response = await clientServer.get("/posts")
            return ThunkAPI.fulfillWithValue(response.data)

        }catch(err){
            return ThunkAPI.rejectWithValue(err.response?.data || "Could not fetch posts")
        }
    }
)

export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkAPI) => {
    const { file, body } = userData;

    try {
      const formData = new FormData();
      formData.append("token", localStorage.getItem("token"));
      formData.append("body", body);

      if (file) {
        formData.append("media", file);
      }

      const response = await clientServer.post("/post", formData);

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Post not uploaded");
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async(postData,thunkAPI)=>{
    try{
      const response =await clientServer.delete("/delete",{
        data:{
          token:localStorage.getItem("token"),
          post_id:postData.post_id
        }
      })

      return thunkAPI.fulfillWithValue(response.data)

    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Post not deleted");
    }
  }
)

export const incrementLike =createAsyncThunk(
  "post/incrementLike",
  async(post, thunkAPI)=>{
    try{
      const response =await clientServer.post('/increment_post_likes',{
        post_id:post.post_id
      })

      return thunkAPI.fulfillWithValue(response.data)


    }catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Post not deleted");
    }

  }
)

export const getAllComments =createAsyncThunk(
  "post/getAllCommetns",
  async(postData,thunkAPI)=>{
    try{
      const response =await clientServer.get("/get_comments",{
        params:{
          post_id:postData.post_id
        }
      });
      return thunkAPI.fulfillWithValue({
        comments:response.data,
        post_id: postData.post_id
      })

    }catch (err) {
      return thunkAPI.rejectWithValue("Something went Wrong ");
    }
  }
)

export const postComment =createAsyncThunk(
  "post/postComment",
  async(commentData, thunkAPI)=>{
    try{
      console.log({
        post_id: commentData.post_id,
        body:commentData.body
      })
      const response =await clientServer.post("/comment",{
        token: localStorage.getItem("token"),
        post_id: commentData.post_id,
        commentBody:commentData.body
      })

      return thunkAPI.fulfillWithValue(response.data)

    }catch (err) {
      return thunkAPI.rejectWithValue("Something went Wrong ");
    }
  }
)
