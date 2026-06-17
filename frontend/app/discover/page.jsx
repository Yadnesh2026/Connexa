"use client";

import React, { useEffect } from "react";
import UserLayout from "../layout/UserLayout/page";
import DashBoardLayout from "../layout/DashBoardLayout/Page";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../config/redux/action/authAction";
import { baseURL } from "../config";
import styles from "./styles.module.css"
import { useRouter } from "next/navigation";

export default function DiscoverPage() {

  const authState= useSelector((state)=>state.auth)
  const dispatch = useDispatch()
  const allUsers = authState.all_users || []
  const router =useRouter();

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

          <div className={styles.allUserProfile}>
            {authState.all_profiles_fetched && allUsers.map((user)=>{
              return(
                <div onClick={()=>{
                  router.push(`/viewProfile/${user.userId.username}`)
                }} key={user._id} className={styles.userCard}>
                  <img className={styles.userCard_image} src={`${baseURL}/${user.userId.profilePicture}`} alt="profile"/>
                  <div>
                     <h1>{user.userId.name}</h1>
                     <p>{user.userId.username}</p>
                  </div>
                 
                </div>
              )
            })}
          </div>
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}
