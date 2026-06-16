import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer"
import postReducer from "./reducer/postReducer"


// Steps for state management
// Submit Action
// Handle Action
// Handle action in its reduce
// Register Here -> Reducer

export const store = configureStore({ // Used to create an redux store
  reducer: {
    auth: authReducer,
    posts: postReducer
  },
});













// What is reducer?

// This is the confusing part.
// Suppose a user logs in.

// Before login:
// Store
// ------
// User : null

// After login:
// Store
// ------
// User : Vedant

// Who changes the data?

// 👉 Reducer
// A reducer is simply a function that updates the store.