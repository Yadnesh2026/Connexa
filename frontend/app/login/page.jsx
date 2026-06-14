"use client";

// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserLayout from "../layout/UserLayout";
import { useRouter } from "next/navigation";
import styles from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";

export default function Login() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [userLogin, setUserLogin] = useState(false);
  const [email, setEmailAddress] = useState("")
  const [username, setUsername] = useState("")
  const [name, setName]= useState("")  

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }

    const handleRegister =()=>{
      dispatch(loginUser())

    }
  });
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>

          <div className={styles.cardContainerLeft}>
            <p className={styles.cardLeftHeading}>
              {userLogin ? "Sign In" : "Sign Up"}
            </p>

            <div className={styles.inputContainers}>

              <div className={styles.inputRow}>
                <input className={styles.inputField} type="text" placeholder="Username" />
                <input className={styles.inputField} type="text" placeholder="Name"/>
              </div>
                <input className={styles.inputField} type="text" placeholder="Email"/>
                <input className={styles.inputField} type="text" placeholder="Password"/>

                <div onClick={()=>{
                  if(userLogin){

                  }else{
                    handleRegister();
                  }
                }} className={styles.buttonWithOutline}>
                  <p> {userLogin ? "Sign In" : "Sign Up"}</p>
                </div>
              


            </div>
          </div>

          <div className={styles.cardContainerRight}></div>
        </div>
      </div>
    </UserLayout>
  );
}
