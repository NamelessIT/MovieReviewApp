
import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignup = async () => {
    if (!email || !fullName || !username || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      console.log("[v0] Creating user...")
      const userRes = await axios.post("http://localhost:5003/api/user", {
        email,
        fullName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false,
      })

      const userId = userRes.data.data.id
      console.log("[v0] User created with ID:", userId)

      console.log("[v0] Creating account...")
      const accountRes = await axios.post("http://localhost:5003/api/account/user", {
        userId,
        username,
        passwordHash: password,
        role: "User",
        isDeleted: false,
      })

      const accountId = accountRes.data.data.id
      console.log("[v0] Account created with ID:", accountId)

      localStorage.setItem("accountId", accountId)
      localStorage.setItem("username", username)

      alert("Sign up successful! Redirecting to homepage...")

      router.push("/user/homepage")
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Sign up failed"
      setError(errorMessage)
      alert(errorMessage)
      console.error("[v0] Signup error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSignup()
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Email</label>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
        <Input
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Username</label>
        <Input
          type="text"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Password</label>
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
        <Input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="w-full"
        />
      </div>

      {error && <div className="text-destructive text-sm">{error}</div>}

      <Button
        onClick={handleSignup}
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {isLoading ? "Creating account..." : "Sign Up"}
      </Button>
    </div>
  )
}
