
import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LoginForm() {
  const router = useRouter()
  const [usernameInput, setUsernameInput] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    if (!usernameInput || !passwordInput) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const res = await axios.post("http://localhost:5003/api/account/login", {
        username: usernameInput,
        password: passwordInput,
      })

      localStorage.setItem("accountId", res.data.data.id)
      localStorage.setItem("username", res.data.data.username)

      alert(res.data.message || "Login successful!")
      console.log("[v0] Login response:", res.data.data)

      router.push("/user/homepage")
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed"
      setError(errorMessage)
      alert(errorMessage)
      console.error("[v0] Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Username</label>
        <Input
          type="text"
          placeholder="Enter your username"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Password</label>
        <Input
          type="password"
          placeholder="Enter your password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="w-full"
        />
      </div>

      {error && <div className="text-destructive text-sm">{error}</div>}

      <Button
        onClick={handleLogin}
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </div>
  )
}
