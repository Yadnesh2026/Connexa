"use client";

import React, { useEffect } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { reset, setTokenisThere } from "@/app/config/redux/reducer/authReducer";
import { getAboutUser } from "@/app/config/redux/action/authAction";

function NavBarComponent() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch =useDispatch()

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !authState.ProfileFetched) {
      dispatch(setTokenisThere());
      dispatch(getAboutUser({ token })).then((result) => {
        if (getAboutUser.rejected.match(result)) {
          localStorage.removeItem("token");
          dispatch(reset());
        }
      });
    }
  }, [authState.ProfileFetched, dispatch]);

  const isSignedIn = authState.ProfileFetched || authState.isTokenThere;
  const displayName = authState.user?.userId?.name || authState.user?.userId?.username;

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <h1 style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
          Connexa
        </h1>

        <div className={styles.navBarOptionContainer}>
          
          {isSignedIn && (
            <div className={styles.signedInControls}>
                
                {displayName && (
                  <p>Hey, {displayName}</p>
                )}

                <button
                  type="button"
                  className={styles.iconButton}
                  aria-label="Profile"
                  title="Profile"
                  onClick={() => {
                    if (authState.user?.userId?.username) {
                      router.push(`/viewProfile/${authState.user.userId.username}`);
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  className={styles.iconButton}
                  aria-label="Log out"
                  title="Log out"
                  onClick={() => {
                    localStorage.removeItem("token");
                    router.push("/login");
                    dispatch(reset());
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3-3h-9m9 0-3-3m3 3-3 3"
                    />
                  </svg>
                </button>
            </div>
          )}

          {!isSignedIn && (
            <div
              onClick={() => {
                router.push("/login")
                dispatch(reset())
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
