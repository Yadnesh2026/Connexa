import { createAsyncThunk } from "@reduxjs/toolkit";

// What is a Thunk?
// A Thunk is a function that can perform asynchronous work before updating the Redux store.

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/login", {
        email: user.email,
        password: user.password,
      });

      //if the login is succesfull
      if (response.data.token) { //Backend sends token - and save the token
        localStorage.setItem("token", response.data.token);
      }else{ //if the toke fails
        return thunkAPI.rejectWithValue({
            message:"token not provided"
        })
      }

      //login success
      return thunkAPI.fulfillWithValue(response.data.token)
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const registerUser =createAsyncThunk(
  "user/register",
  async(user,thunkAPI)=>{
    try{

      const request = await clientServer.post("/register",{
        username:user.username,
        password:user.password,
        email:user.email,
        name:user.name

      })

    }catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
)


