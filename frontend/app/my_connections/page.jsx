import React, { useEffect, useEffectEvent } from "react";
import UserLayout from "../layout/UserLayout/page";
import DashBoardLayout from "../layout/DashBoardLayout/Page";
import { useDispatch, useSelector } from "react-redux";
import { getMyConnectionRequest } from "../../../backend/controllers/user.controller";

export default function MyConnectionsPage() {
  const dispatch =useDispatch()
  const authState = useSelector((state)=> state.auth)

  useEffect(()=>{
    dispatch(getMyConnectionRequest({token:localStorage.getItem("token")}))
  },[])

  useEffect(()=>{
    if(authState.connectionsRequest.length !=0){
       console.log(authState.connectionsRequest)
    }
   

  },[authState.connectionsRequest])
  return (
    <UserLayout>
      <DashBoardLayout>
        <div>
          <h1>My Connections</h1>
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}
