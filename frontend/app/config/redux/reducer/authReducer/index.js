import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, getConnectionReq, getMyConnectionRequests, loginUser, registerUser } from "../../action/authAction";

const initialState = {
  user: undefined,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  isTokenThere :false,
  ProfileFetched: false,
  connections: [],
  connectionRequest: [],
  all_users:[],
  all_profiles_fetched:false
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    reset: () => initialState,

    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage:(state)=>{
      state.message =""
    },
    setTokenisThere: (state)=>{
      state.isTokenThere =true
    },
    setTokenisNotThere:(state)=>{
      state.isTokenThere =false
    }
  },

  extraReducers: (builder) => {
    builder

      // LOGIN PENDING
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Knocking the door...";
      })

      // LOGIN SUCCESS
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.user = action.payload;
        state.message ={
          message :"Signed in successfully"
        };
      })

      // LOGIN FAILED
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.loggedIn = false;
        state.message = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = { message: "Creating your account..." };
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = { message: "User has registered successfully. Please sign in." };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || { message: "Registration failed" };
      })
      .addCase(getAboutUser.fulfilled,(state,action)=>{
        state.isLoading =false;
        state.isError =false;
        state.ProfileFetched = true;
        state.user =action.payload;
        // state.connections = action.payload.connections
        // state.connectionRequest =action.payload.connectionRequest
      })
      .addCase(getAllUsers.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.isError = false;
        state.all_profiles_fetched =true;
        state.all_users =action.payload.profiles
      })
      .addCase(getConnectionReq.fulfilled,(state,action)=>{
        state.connections = action.payload
      })
      .addCase(getConnectionReq.rejected,(state,action)=>{
        state.connections = []
        state.message = action.payload
      })
      .addCase(getMyConnectionRequests.fulfilled,(state,action)=>{
        state.connectionRequest =action.payload
      })
      .addCase(getMyConnectionRequests.rejected,(state,action)=>{
        state.message =action.payload
      })
  },
});

export const { reset, emptyMessage,setTokenisThere,setTokenisNotThere } = authSlice.actions;

export default authSlice.reducer;
