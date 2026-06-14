"use client";

import { useRouter } from "next/navigation";
import React from "react";
import styles from "./Home.module.css";
import UserLayout from "./layout/UserLayout"

export default function Home() {
  const router = useRouter();
  return (
    <UserLayout>
      
      <div className={styles.container}>

        <div className={styles.mainContainer}>
          <div className={styles.mainContainerLeft}>
            <p>Connect with friends without Exaggreation</p>
            <p>A True Soical media platform wihht stoires no blufs</p>

            <div
              onClick={() => router.push("/login")}
              className={styles.buttonJoin}
            >
              <p>Join Now</p>
            </div>
          </div>

          <div className={styles.mainContainerRight}>
            <img src="/public.png" alt="public img" />
          </div>
        </div>
      </div>

    </UserLayout>
  );
}
