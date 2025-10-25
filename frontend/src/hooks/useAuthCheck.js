"use client"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function useAuthCheck() {
  const navigate = useNavigate()

  useEffect(() => {
    const accountId = localStorage.getItem("accountId")
    const username = localStorage.getItem("username")

    if (!accountId || !username) {
      navigate("/auth") // chuyển hướng đến trang đăng nhập
    }
  }, [navigate])
}
