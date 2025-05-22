"use client"
import React from 'react'
import Cookie from 'js-cookie'
import { useRouter } from "next/navigation";

function Logoutbtn() {
    const router = useRouter()
    const handleLogout = () => {
        Cookie.remove("userSession")
        router.push("/login")
    }
    return (
        <button className="text-left text-red-500 hover:text-red-500 hover:bg-red-100" onClick={handleLogout}>logout</button>
    )
}

export default Logoutbtn