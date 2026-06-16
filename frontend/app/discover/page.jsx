"use client";

import React, { useEffect } from "react";
import UserLayout from "../layout/UserLayout/page";
import DashBoardLayout from "../layout/DashBoardLayout/Page";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../config/redux/action/authAction";

export default function DiscoverPage() {

  const authState= useSelector((state)=>state.auth)
  const dispatch = useDispatch()

  useEffect(()=>{
    if(!authState.all_profiles_fetched){
      dispatch(getAllUsers())
    }
  },[])
  return (
    <UserLayout>
      <DashBoardLayout>
        <div>
          <h1>Discover Page</h1>
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}
