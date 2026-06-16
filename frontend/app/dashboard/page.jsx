"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser } from "../config/redux/action/authAction";
import UserLayout from "../layout/UserLayout/page.jsx";
import { getAllPosts } from "../config/redux/action/postAction";
import DashBoardLayout from "../layout/DashBoardLayout/Page.jsx";
import { getAllUsers } from "../config/redux/action/authAction";
import styles from "./styles.module.css" 
import { baseURL } from "../config/index.jsx";

export default function Dashboard() {
  const router = useRouter();
  // const [isTokenthere, setIsTokenThere] = useState(false);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);



  useEffect(() => {

    if (authState.isTokenThere) {
     console.log("Calling getAboutUser");
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }

     if(!authState.all_profiles_fetched){
          dispatch(getAllUsers())
        }


  }, [authState.isTokenThere]);


  return (
    <UserLayout>
      {/* {authState.profileFetched && <div>Hey {authState.user.userId.name}</div>} */}

      <DashBoardLayout>
        <div className="scrollComponent">
          <div className={styles.createPostContainer}>
          <img width={100} src={`${baseURL}/${authState.user?.userId?.profilePicture}`}/>
          </div>
        </div>
      </DashBoardLayout>
      
    </UserLayout>
  );
}
