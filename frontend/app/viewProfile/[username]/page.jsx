"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import UserLayout from "../../layout/UserLayout/page";
import DashBoardLayout from "../../layout/DashBoardLayout/Page";
import { clientServer, baseURL } from "../../config";
import styles from "../styles.module.css";
import {getAllPosts} from "../../config/redux/action/postAction"
import {getConnectionReq,getMyConnectionRequests,sendConnectionRequest} from "../../config/redux/action/authAction"

export default function ViewProfilePage() {
  const { username } = useParams();           // <-- replaces "await params"
  const dispatch = useDispatch();
  const postReducer = useSelector((state) => state.postReducer);
  const authState = useSelector((state) => state.auth);

  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentInConnection, setIsCurrentInConnection] = useState(false);
  const [isConnectionNull, setIsConnectionNull] =useState(true);
  const [profileError, setProfileError] = useState("");

  

  // fetch the profile on the client instead of awaiting it in the component body
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileError("");
        setUserProfile(null);
        const request = await clientServer.get(
          "/user/getUserProfileAndUserBasedOnUsername",
          { params: { username } }
        );

        if (!request.data.profile) {
          setProfileError("Profile not found");
          return;
        }

        setUserProfile(request.data.profile);
      } catch (err) {
        setProfileError(err.response?.data?.message || "Profile not found");
      }
    };
    if (username) fetchProfile();
  }, [username]);




  const getUserPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(getConnectionReq({ token: localStorage.getItem("token") }));
    await dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}))

  };

useEffect(() => {
  if (!postReducer?.posts) return;
  const posts = postReducer.posts.filter((post) => {
    return post.userId?.username === username;
  });
  setUserPosts(posts);
}, [postReducer?.posts, username]);




  useEffect(() => {

    if (!userProfile) return;

    const profileUserId = userProfile.userId._id;
    const sentRequests = Array.isArray(authState.connections) ? authState.connections : [];
    const receivedOrAcceptedRequests = Array.isArray(authState.connectionRequest)
      ? authState.connectionRequest
      : [];

    const existingConnection = [...sentRequests, ...receivedOrAcceptedRequests].find((connection) => {
      return (
        connection.userId?._id === profileUserId ||
        connection.connectionId?._id === profileUserId
      );
    });

    setIsCurrentInConnection(Boolean(existingConnection));
    setIsConnectionNull(existingConnection?.status_accepted !== true);

  }, [authState.connections, userProfile, authState.connectionRequest]);






  useEffect(() => {
    getUserPost()
  }, []);

  if (profileError) {
    return (
      <UserLayout>
        <DashBoardLayout>
          <div className={styles.container}>
            <h2>{profileError}</h2>
          </div>
        </DashBoardLayout>
      </UserLayout>
    );
  }

  if (!userProfile) return <div>Loading...</div>; // guard, since data now arrives async

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img
              className={styles.backDrop}
              src={`${baseURL}/${userProfile.userId?.profilePicture || "default.jpg"}`}
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
                  <h2>{userProfile.userId?.name}</h2>
                  <p style={{ color: "grey" }}>@{userProfile.userId?.username}</p>
                </div>

                <div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
                    {isCurrentInConnection ? (
                      <button className={styles.connectedButton}>{isConnectionNull ?"Pending":"Connected"}</button>
                    ) : (
                      <button
                        onClick={async () => {
                          await dispatch(
                            sendConnectionRequest({
                              token: localStorage.getItem("token"),
                              user: userProfile.userId,
                            })
                          );
                          setIsCurrentInConnection(true);
                          setIsConnectionNull(true);
                          dispatch(getConnectionReq({ token: localStorage.getItem("token") }));
                          dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}));
                        }}
                        className={styles.connectBtn}
                      >
                        Connect
                      </button>
                    )}

                    <div onClick={async()=>{
                      try {
                        const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId?._id}`);
                        const outputPath = response.data.outputPath;

                        if (!outputPath) {
                          alert(response.data.message || "Resume could not be generated.");
                          return;
                        }

                        window.open(`${baseURL}${outputPath}`, "_blank");
                      } catch (err) {
                        alert(err.response?.data?.message || "Resume could not be generated.");
                      }
                    }} style={{cursor:"pointer"}}>
                      <svg style={{width:"1.2em"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </div>

                </div>

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
                (userProfile.pastwork || []).map((work,index)=>{
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
