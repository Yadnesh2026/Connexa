"use client";

import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

function NavBarComponent() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  console.log(authState);
  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <h1 style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
          Pro Connect
        </h1>

        <div className={styles.navBarOptionContainer}>
          {authState.ProfileFetched && (
            <div>
              <div style={{ display: "flex", gap: "1.2rem" }}>
                
                {authState.user?.userId && (
                  <p>Hey, {authState.user.userId.name}</p>
                )}

                <p style={{ fontWeight: "bold", cursor: "pointer" }}>
                  Profile{" "}
                </p>
              </div>
            </div>
          )}

          {!authState.ProfileFetched && (
            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.buttonJoin}
            >
              <p>Be a Part</p>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default NavBarComponent;
