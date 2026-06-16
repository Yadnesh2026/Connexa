import { createAsyncThunk } from '@reduxjs/toolkit'
import React from 'react'

export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async(_, ThunkAPI)=>{
        try{
            const response = await clientServer.get("/posts")
            return ThunkAPI.fulfillWithValue(response.data)

        }catch(err){
            return ThunkAPI.rejectWithValue(err.response.data)
        }
    }
)