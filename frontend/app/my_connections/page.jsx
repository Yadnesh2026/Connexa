"use client";

import React, { useEffect } from "react";
import UserLayout from "../layout/UserLayout/page";
import DashBoardLayout from "../layout/DashBoardLayout/Page";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { baseURL } from "../config";
import { useRouter } from "next/navigation";
import { AcceptConnection, getMyConnectionRequests } from "../config/redux/action/authAction";

export default function MyConnectionsPage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter()
  const connectionRequests = authState.connectionRequest || [];
  const pendingRequests = connectionRequests.filter((connection)=> connection.status_accepted === null);
  const acceptedConnections = connectionRequests.filter((connection)=> connection.status_accepted === true);
  const currentUserId = authState.user?.userId?._id;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getMyConnectionRequests({ token }));
    }
  }, [dispatch]);

  const getConnectionUser = (connection) => {
    if (connection.userId?._id === currentUserId) {
      return connection.connectionId;
    }

    return connection.userId;
  };

  const isIncomingRequest = (connection) => {
    return connection.connectionId?._id === currentUserId;
  };

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={styles.page}>
          <div className={styles.header}>
            <div>
              <p className={styles.eyebrow}>Network</p>
              <h1>My Connections</h1>
            </div>
            <div className={styles.stats}>
              <div>
                <strong>{pendingRequests.length}</strong>
                <span>Pending</span>
              </div>
              <div>
                <strong>{acceptedConnections.length}</strong>
                <span>Connected</span>
              </div>
            </div>
          </div>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Connection Requests</h2>
              <span>{pendingRequests.length}</span>
            </div>

            {pendingRequests.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No Pending Requests</h3>
                <p>New connection requests will appear here.</p>
              </div>
            ) : (
              <div className={styles.list}>
                {pendingRequests.map((connection) => {
                  const user = getConnectionUser(connection);
                  const incoming = isIncomingRequest(connection);

                  return (
                    <div
                      onClick={() => router.push(`/viewProfile/${user?.username}`)}
                      className={styles.userCard}
                      key={connection._id}
                    >
                      <div className={styles.profilePicture}>
                        <img
                          src={`${baseURL}/${user?.profilePicture || "default.jpg"}`}
                          alt={user?.name || "Profile"}
                        />
                      </div>
                      <div className={styles.userInfo}>
                        <h3>{user?.name}</h3>
                        <p>@{user?.username}</p>
                      </div>
                      {incoming ? (
                        <button
                          onClick={(e)=>{
                            e.stopPropagation()

                            dispatch(AcceptConnection({
                              connectionId:connection._id,
                              token:localStorage.getItem("token"),
                              action:"accept"
                            }))
                          }}
                          className={styles.connectedButton}
                        >
                          Accept
                        </button>
                      ) : (
                        <span className={styles.pendingPill}>Sent</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>My Network</h2>
              <span>{acceptedConnections.length}</span>
            </div>

            {acceptedConnections.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No Connections Yet</h3>
                <p>Accepted connections will be listed here.</p>
              </div>
            ) : (
              <div className={styles.list}>
                {acceptedConnections.map((connection)=>{
                  const user = getConnectionUser(connection);

                  return (
                    <div
                      onClick={() => router.push(`/viewProfile/${user?.username}`)}
                      className={styles.userCard}
                      key={connection._id}
                    >
                      <div className={styles.profilePicture}>
                        <img
                          src={`${baseURL}/${user?.profilePicture || "default.jpg"}`}
                          alt={user?.name || "Profile"}
                        />
                      </div>
                      <div className={styles.userInfo}>
                        <h3>{user?.name}</h3>
                        <p>@{user?.username}</p>
                      </div>
                      <span className={styles.statusPill}>Connected</span>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </DashBoardLayout>
    </UserLayout>
  )
}
