import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, loginUser } from "../../action/authAction";

const initialState = {
  user: [],
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
  all_profiles_fetching:false
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
          message :"Registration is Successfull, Please Login "
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
        state.all_profiles_fetching =true;
        state.all_users =action.payload.profiles
      })
  },
});

export const { reset, emptyMessage,setTokenisThere,setTokenisNotThere } = authSlice.actions;

export default authSlice.reducer;