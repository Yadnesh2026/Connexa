"use client";

import React from 'react'
import styles from "./styles.module.css"
import { useRouter } from 'next/navigation'

function NavBarComponent() {
    const router = useRouter()
  return (
    <div className={styles.container}>
        <nav className={styles.navbar}>
            <h1 style={{cursor:"pointer"}} onClick={()=> router.push("/")}>Pro Connect</h1>

            <div className={styles.navBarOptionContainer}>

                <div onClick={()=>{router.push("/login")}} className={styles.buttonJoin}><p>Be a Part</p></div>


            </div>

        </nav>
    </div>
  )
}

export default NavBarComponent