"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import UserLayout from "../../layout/UserLayout/page";
import DashBoardLayout from "../../layout/DashBoardLayout/Page";
import { clientServer, getMediaUrl, handleImageError } from "../../config";
import styles from "../styles.module.css";
import {getAllPosts} from "../../config/redux/action/postAction"
import {getAboutUser,getAllUsers,getConnectionReq,getMyConnectionRequests,sendConnectionRequest} from "../../config/redux/action/authAction"

export default function ViewProfilePage() {
  const { username } = useParams();           // <-- replaces "await params"
  const router = useRouter();
  const dispatch = useDispatch();
  const postReducer = useSelector((state) => state.posts);
  const authState = useSelector((state) => state.auth);

  const [userProfile, setUserProfile] = useState(null);
  const [connectionOverride, setConnectionOverride] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");

  


  

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

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  const userPosts = useMemo(() => {
    if (!postReducer.posts) return [];

    return postReducer.posts.filter((post) => {
    return post.userId?.username === username;
  });
}, [postReducer.posts, username]);




  const existingConnection = useMemo(() => {
    if (!userProfile) return null;

    const profileUserId = userProfile.userId._id;
    const sentRequests = Array.isArray(authState.connections) ? authState.connections : [];
    const receivedOrAcceptedRequests = Array.isArray(authState.connectionRequest)
      ? authState.connectionRequest
      : [];

    return [...sentRequests, ...receivedOrAcceptedRequests].find((connection) => {
      return (
        connection.userId?._id === profileUserId ||
        connection.connectionId?._id === profileUserId
      );
    });
  }, [authState.connections, userProfile, authState.connectionRequest]);

  const activeConnection = connectionOverride || existingConnection;
  const isCurrentInConnection = Boolean(activeConnection);
  const isConnectionNull = activeConnection?.status_accepted !== true;
  const isOwnProfile = authState.user?.userId?.username === userProfile?.userId?.username;

  const refreshProfile = async () => {
    const request = await clientServer.get(
      "/user/getUserProfileAndUserBasedOnUsername",
      { params: { username } },
    );

    setUserProfile(request.data.profile);
  };

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files?.[0];
    const token = localStorage.getItem("token");

    if (!file || !token || !isOwnProfile) return;

    if (!file.type.startsWith("image/")) {
      setStatusMessage("Please choose an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatusMessage("Profile photo must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreviewUrl((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }

      return previewUrl;
    });

    const formData = new FormData();
    formData.append("token", token);
    formData.append("profile", file);

    setStatusMessage("");

    try {
      await clientServer.post("/upload_profile", formData);
      await refreshProfile();
      await dispatch(getAboutUser({ token }));
      await dispatch(getAllUsers());
      setStatusMessage("Profile photo updated.");
      setPhotoPreviewUrl("");
    } catch (err) {
      setStatusMessage(
        err.response?.data?.message || "Profile photo could not be uploaded.",
      );
    } finally {
      event.target.value = "";
    }
  };


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(getAboutUser({ token }));
    }
    dispatch(getAllPosts());
    dispatch(getConnectionReq({ token }));
    dispatch(getMyConnectionRequests({ token }));
  }, [dispatch]);

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
            <div className={styles.profilePhotoWrap}>
              {isOwnProfile && (
                <>
                  <label
                    htmlFor="viewProfilePhotoUpload"
                    className={styles.changePhotoOverlay}
                  >
                    Change Photo
                  </label>
                  <input
                    id="viewProfilePhotoUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                  />
                </>
              )}
              <img
                className={styles.backDrop}
                src={photoPreviewUrl || getMediaUrl(userProfile.userId?.profilePicture)}
                onError={handleImageError}
                alt="profile"
                width={150}
              />
            </div>
          </div>

          {statusMessage && (
            <p className={styles.statusMessage}>{statusMessage}</p>
          )}

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
                    {isOwnProfile && (
                      <>
                        <button
                          type="button"
                          className={styles.editProfileButton}
                          onClick={() => router.push("/profile")}
                        >
                          Edit Profile
                        </button>
                        <label
                          htmlFor="viewProfilePhotoUpload"
                          className={styles.uploadPhotoButton}
                        >
                          Upload Photo
                        </label>
                      </>
                    )}

                    {!isOwnProfile && (
                      <>
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
                          setConnectionOverride({ status_accepted: null });
                          dispatch(getConnectionReq({ token: localStorage.getItem("token") }));
                          dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}));
                        }}
                        className={styles.connectBtn}
                      >
                        Connect
                      </button>
                    )}
                    </>
                    )}

                    <div onClick={async()=>{
                      try {
                        const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId?._id}`);
                        const outputPath = response.data.outputPath;

                        if (!outputPath) {
                          alert(response.data.message || "Resume could not be generated.");
                          return;
                        }

                        window.open(getMediaUrl(outputPath, ""), "_blank");
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
                       {post.media !==""? (
                        <img
                          src={getMediaUrl(post.media, "")}
                          alt=""
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                       )
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
            <div className={styles.workHistoryHeader}>
              <div>
                <h4>Work History</h4>
                <p>Experience, roles, and professional background.</p>
              </div>
              {isOwnProfile && (
                <button
                  type="button"
                  className={styles.addWorkButton}
                  onClick={() => router.push("/profile")}
                >
                  Add Work History
                </button>
              )}
            </div>
            <div className={styles.workHistoryContainer}>
              {(userProfile.pastwork || []).length === 0 ? (
                <div className={styles.emptyWorkHistory}>
                  <h5>No work history added yet</h5>
                  <p>
                    Add company, role, and duration to make this profile look complete and professional.
                  </p>
                  {isOwnProfile && (
                    <button
                      type="button"
                      className={styles.addWorkButton}
                      onClick={() => router.push("/profile")}
                    >
                      Write Work History
                    </button>
                  )}
                </div>
              ) : (
                (userProfile.pastwork || []).map((work,index)=>{
                  return(
                    <div key={index} className={styles.workHistoryCard}>
                      <p style={{fontWeight:"bold", display:"flex",alignItems:"center",gap:"0.8rem"}}>{work.company} - {work.position}</p>
                      <p>{work.years}</p>
                    </div>
                  )
                })
              )}
            </div>
          </div>



        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}
