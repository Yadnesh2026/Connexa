import React, { useState } from 'react'
import UserLayout from '../layout/UserLayout/page'
import DashBoardLayout from '../layout/DashBoardLayout/Page'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAboutUser } from '../config/redux/action/authAction'
import styles from "./styles.module.css"
import { baseURL, clientServer } from '../config'
import { getAllPosts } from '../config/redux/action/postAction'

export default function ProfilePage() {
    const dispatch = useDispatch()
    const authState = useSelector((state)=>state.auth)
    const [userProfile,setUserProfile]= useState({})
    const [userPosts,setUserPost] =useState([])
    const postReducer =useSelector((state)=>state.postReducer)
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [inputData, setInputData] = useState({company:'', position:'', years:''})

    const handleWorkInputChange = (e)=>{
      const {name,value} = e.target;
      setInputData({...inputData,[name]:value})
    }
    // const [userProfile,setUserProfile] = useState({
    //     userId:{
    //         name:"",
    //         username:"",
    //         profilePicture:""
    //     },
    //     bio:"",
    //     pastwork:[]
    // })



    useEffect(()=>{
        dispatchEvent(getAboutUser({token:localStorage.getItem("token")}))
        dispatch(getAllPosts())
    },[])



    useEffect(()=>{

      if(authState.user != undefined){
      setUserProfile(authState.user)

        let post = postReducer.posts.filter((post)=>{
          return post.userId.username === authState.user.userId.username
        })
      setUserPosts(posts);

      }

    },[authState.user,postReducer.posts])

    const response =await clientServer.post("/update_profile_data",{
      token:localStorage.getItem("token"),
      bio:userProfile.bio,
      currentPost: userProfile.currentPost,
      pastwork:userProfile.pastwork,
      education:userProfile.education
    })
    dispatch(getAboutUser({token:localStorage.getItem("token")}))
  }


  return (
    <UserLayout>
        <DashBoardLayout>
          {authState.user && userProfile.userId &&
                      <div className={styles.container}>
                              <div className={styles.backDropContainer}>
                          
                                  <label htmlFor='profilePictureUpload' className={styles.backDrop__overlay}>
                                    <p>Edit</p>
                                  </label>

                                  <input type='file' id='profilePictureUpload'/>
                                <img
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
                              <button className={styles.addWorkButton} onClick={()=>{
                                setIsModelOpen(true)
                              }}>Add Work</button>
                    
                              <div className={styles.addWorkButton}>
                                <h4>Work Experience </h4>
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

                            
}

{isModelOpen && (
  <div
    className={styles.commentsContainer}
    onClick={() => isModelOpen(false)}
  >
    <div>
      <div
        className={styles.allCommentsContainer}
        onClick={(e) => e.stopPropagation()}
      >
  <input onChange={(e)=>handleWorkInputChange} name='company' className={styles.inputField} type="text" placeholder="Enter Work Place"/>
  <input onChange={(e)=>handleWorkInputChange} name='position' className={styles.inputField} type="text" placeholder="Enter Company "/>
  <input onChange={(e)=>handleWorkInputChange} name='years'  className={styles.inputField} type="text" placeholder="Years"/>
  <div onClick={()=>{
    setUserProfile({...userProfile})
  }}  className={styles.updateProfilebtn}>Add Work </div>
      </div>
    </div>
  </div>
)}
        </DashBoardLayout>
    </UserLayout>
  )

