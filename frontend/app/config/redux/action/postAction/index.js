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
