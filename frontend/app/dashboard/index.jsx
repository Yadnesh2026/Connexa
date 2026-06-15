import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function Dashboard() {

    const router = useRouter()

    useEffect(()=>{
      if (!localStorage.getItem("token")) {
    router.push("/login");
}
    })
  return (
    <div>Dashboard</div>
  )
}
