"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import UserLayout from "../../layout/UserLayout/page";
import DashBoardLayout from "../../layout/DashBoardLayout/Page";
import { clientServer, baseURL } from "../../config";
import styles from "../styles.module.css";
import {getAllPosts} from "../../config/redux/action/postAction"
import {getConnectionReq,sendConnectionRequest} from "../../config/redux/action/authAction"

export default function ViewProfilePage() {
  const { username } = useParams();           // <-- replaces "await params"
  const dispatch = useDispatch();
  const postReducer = useSelector((state) => state.postReducer);
  const authState = useSelector((state) => state.auth);

  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentInConnection, setIsCurrentInConnection] = useState(false);
  const [isConnectionNull, setIsConnectionNull] =useState(true);

  

  // fetch the profile on the client instead of awaiting it in the component body
  useEffect(() => {
    const fetchProfile = async () => {
      const request = await clientServer.get(
        "/user/getUserProfileAndUserBasedOnUsername",
        { params: { username } }
      );
      setUserProfile(request.data.profile);
    };
    if (username) fetchProfile();
  }, [username]);




  const getUserPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(getConnectionReq({ token: localStorage.getItem("token") }));
  };

useEffect(() => {
  if (!postReducer?.posts) return;
  const posts = postReducer.posts.filter((post) => {
    return post.userId?.username === username;
  });
  setUserPosts(posts);
}, [postReducer?.posts, username]);


  useEffect(() => {

    if (!userProfile || !Array.isArray(authState.connections)) return;

    if (
      authState.connections.some(
        (user) => user.connectionId?._id === userProfile.userId._id
      )
    ) {
      setIsCurrentInConnection(true);
      if(authState.connections.find(user => user.connectionId?._id === userProfile.userId._id).status_accepted ===true){
        setIsConnectionNull(false)
      }
    }
  }, [authState.connections, userProfile]);


  useEffect(() => {
    getUserPost()
  }, []);

  if (!userProfile) return <div>Loading...</div>; // guard, since data now arrives async

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img
              className={styles.backDrop}
              src={`${baseURL}/${userProfile.userId.profilePicture}`}
              alt="profile"
              width={150}
            />
          </div>

          {/* All Profile Deatils */}
          <div className={styles.profileContainer_details}>
            <div style={{ display: "flex", gap: "0.7rem" }}>
              <div style={{ flex: "0.8" }}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                  }}
                >
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: "grey" }}>@{userProfile.userId.username}</p>
                </div>

                {isCurrentInConnection ? (
                  <button className={styles.connectedButton}>{isConnectionNull ?"Pending":"Connected"}</button>
                ) : (
                  <button
                    onClick={() => {
                      dispatch(
                        sendConnectionRequest({
                          token: localStorage.getItem("token"),
                          user: userProfile.userId,
                        })
                      );
                    }}
                    className={styles.connectBtn}
                  >
                    Connect
                  </button>
                )}

                <div>
                  <p>{userProfile.bio}</p>
                </div>
              </div>

              <div style={{ flex: "0.2" }}>
                <h3>Recent Activity </h3>
                {userPosts.map((post)=>{
                  return <div key={post._id} className={styles.postCard}>
            
                    <div className={styles.card}>
                      <div className={styles.card_profileContainer}>
                       {post.media !==""? <img src={`${baseURL}/${post.media}`} alt=""/>
                       :<div style={{width:"3.4rem",height:"3.4rem"}}></div>     }
                      </div>

                      <p>{post.body}</p>
                    </div>
                  </div>

                })}
              </div>



            </div>



          </div>

          <div className="workHistory">
            <h4>Work History</h4>
            <div className={styles.workHistoryContainer}>
              {
                userProfile.pastwork.map((work,index)=>{
                  return(
                    <div key={index} className={styles.workHistoryCard}>
                      <p style={{fontWeight:"bold", display:"flex",alignItems:"center",gap:"0.8rem"}}>{work.company} - {work.position}</p>
                      <p>{work.years}</p>
                    </div>
                  )
                })
              }
            </div>
          </div>



        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}
