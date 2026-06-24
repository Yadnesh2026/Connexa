"use client";

// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserLayout from "../layout/UserLayout/page";
import { useRouter } from "next/navigation";
import styles from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../config/redux/action/authAction";
import { emptyMessage } from "../config/redux/reducer/authReducer";

export default function Login() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [userLogin, setUserLogin] = useState(false);
  const [email, setEmailAddress] = useState("")
  const [username, setUsername] = useState("")
  const [name, setName]= useState("")  
  const [password, setPassword] = useState("")
  const statusMessage = typeof authState.message === "string"
    ? authState.message
    : authState.message?.message;

  useEffect(() => {
    if (authState.loggedIn) {
      const redirectTimer = setTimeout(() => {
        router.push("/dashboard");
      }, 900);

      return () => clearTimeout(redirectTimer);
    }
  },[authState.loggedIn, router]);

  useEffect(()=>{

    if(localStorage.getItem("token")){
      router.push("/dashboard")
    }

  },[])

  useEffect(()=>{
    dispatch(emptyMessage());
  },[userLogin])

   const handleRegister = () => {
  console.log("Register button clicked");

  dispatch(
    registerUser({
      username,
      password,
      email,
      name,
    })
  ).then((result) => {
    if (registerUser.fulfilled.match(result)) {
      setUserLogin(true);
    }
  });
};

const handleLogin =()=>{
  console.log("Login")
  dispatch(loginUser({email, password}))
}



  return (
    <UserLayout>

     
      <div className={styles.container}>
        <div className={styles.cardContainer}>

          <div className={styles.cardContainerLeft}>
            <p className={styles.cardLeftHeading}>
              {userLogin ? "Sign In" : "Sign Up"}
            </p>
              {statusMessage && (
                <p className={authState.isError ? styles.errorMessage : styles.successMessage}>
                  {statusMessage}
                </p>
              )}

            <div className={styles.inputContainers}>

              {!userLogin && <div className={styles.inputRow}>
                <input onChange={(e)=> setUsername(e.target.value)} className={styles.inputField} type="text" placeholder="Username" />
                <input onChange={(e)=> setName(e.target.value)} className={styles.inputField} type="text" placeholder="Name"/>
              </div>}
                <input onChange={(e)=>setEmailAddress(e.target.value)} className={styles.inputField} type="text" placeholder="Email"/>
                <input onChange={(e)=>setPassword(e.target.value)} className={styles.inputField} type="text" placeholder="Password"/>

                <div onClick={()=>{
                  if(userLogin){
                    handleLogin()

                  }else{
                    handleRegister();
                  }
                }} className={styles.buttonWithOutline}>
                  <p> {userLogin ? "Sign In" : "Sign Up"}</p>
                </div>
              


            </div>
          </div>

          <div className={styles.cardContainerRight}>
            
              {userLogin ?<p>Don&apos;t have an Account?</p> :<p>Already have an Account</p>}
                 <div onClick={()=>{
                  setUserLogin(!userLogin)
                }} style={{color:"black",textAlign:"center"}} className={styles.buttonWithOutline}>
                  <p> {userLogin ? "Sign Up" : "Sign In"}</p>
              
                </div>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}
