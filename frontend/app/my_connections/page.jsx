"use client";

import React, { useEffect } from "react";
import UserLayout from "../layout/UserLayout/page";
import DashBoardLayout from "../layout/DashBoardLayout/Page";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { baseURL } from "../config";
import { useRouter } from "next/navigation";
import { AcceptConnection, getMyConnectionRequests } from "../config/redux/action/authAction";

export default function MyConnectionsPage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter()
  const connectionRequests = authState.connectionRequest || [];
  const pendingRequests = connectionRequests.filter((connection)=> connection.status_accepted === null);

  useEffect(() => {
    dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
  }, [dispatch]);

  useEffect(() => {
    if (connectionRequests.length !== 0) {
      console.log(connectionRequests);
    }
  }, [connectionRequests]);
  return (
    <UserLayout>
      <DashBoardLayout>
        <div>
          <h1>My Connections</h1>


          {pendingRequests.length === 0 && <h1>No Connection Request Pending </h1>}

          {pendingRequests.length !== 0 &&
            pendingRequests.map((user) => {
              return (
                <div onClick={()=>{
                  router.push(`/viewProfile/${user.userId?.username}`)
                }} className={styles.userCard} key={user._id}>
                  <div style={{ display: "flex", alignItems: "center",gap:"1.2rem",justifyContent:"space-between" }}>
                    <div className={styles.profilePicture}>
                      <img
                        src={`${baseURL}/${user.userId?.profilePicture || "default.jpg"}`}
                        alt=""
                      />
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.userId?.name}</h3>
                      <p>{user.userId?.username}</p>
                    </div>
                     <button onClick={(e)=>{
                      e.stopPropagation()

                      dispatch(AcceptConnection({
                        connectionId:user._id,
                        token:localStorage.getItem("token"),
                        action:"accept"
                      }))
                     }} className={styles.connectedButton}>Accept</button>
                  </div>
                </div>
              );
            })}

      
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}
