"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // ✅ Cập nhật giá trị input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isLogin) {
        // ✅ Gọi API đăng nhập
        const res = await axios.post("http://localhost:5003/api/auth/login", {
          username: formData.username,
          password: formData.password,
        })

        const data = res.data.data
        // ✅ Lưu thông tin vào localStorage
        localStorage.setItem("accountId", data.Id)
        localStorage.setItem("username", data.Username)
        localStorage.setItem("role", data.Role)
        localStorage.setItem("fullName", data.UserFullName || "")

        navigate("/user/homepage")
      } else {
        // ✅ 1. Tạo user trước
        const userRes = await axios.post("http://localhost:5003/api/user", {
          fullName: formData.fullName || formData.username,
          email: formData.email,
        })
        const newUserId = userRes.data.data.id

        // ✅ 2. Tạo account liên kết user vừa tạo
        const accRes = await axios.post("http://localhost:5003/api/account", {
          username: formData.username,
          password: formData.password,
          userId: newUserId,
        })

        if (accRes.status === 200 || accRes.status === 201) {
          alert("Tạo tài khoản thành công! Giờ hãy đăng nhập.")
          setIsLogin(true)
          setFormData({ username: "", password: "", email: "", fullName: "" })
        }
      }
    } catch (err) {
      console.error(err)
      const message =
        err.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <motion.div
        className="relative bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden w-full max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="text-center py-6 border-b border-white/20">
          <h1 className="text-3xl font-semibold text-white tracking-wide">
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </h1>
          <p className="text-sm text-gray-300 mt-2">
            {isLogin
              ? "Chào mừng quay lại với SuggestFilm!"
              : "Tạo tài khoản mới để bắt đầu hành trình phim của bạn"}
          </p>
        </div>

        {/* Form */}
        <div className="relative overflow-hidden h-[380px]">
          <AnimatePresence mode="wait">
            {isLogin ? (
              // ✅ FORM LOGIN
              <motion.form
                key="login"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", duration: 0.6 }}
                onSubmit={handleSubmit}
                className="absolute inset-0 flex flex-col justify-center p-8 space-y-4"
              >
                <input
                  type="text"
                  name="username"
                  placeholder="Tên đăng nhập"
                  value={formData.username}
                  onChange={handleChange}
                  className="p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  className="p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none"
                  required
                />

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 transition-colors disabled:opacity-50"
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>

                <p className="text-gray-300 text-sm text-center mt-2">
                  Chưa có tài khoản?{" "}
                  <button
                    type="button"
                    className="text-blue-400 hover:underline"
                    onClick={() => setIsLogin(false)}
                  >
                    Đăng ký ngay
                  </button>
                </p>
              </motion.form>
            ) : (
              // ✅ FORM SIGNUP
              <motion.form
                key="signup"
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: "spring", duration: 0.6 }}
                onSubmit={handleSubmit}
                className="absolute inset-0 flex flex-col justify-center p-8 space-y-4"
              >
                <input
                  type="text"
                  name="username"
                  placeholder="Tên đăng nhập"
                  value={formData.username}
                  onChange={handleChange}
                  className="p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Họ và tên"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  className="p-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none"
                  required
                />

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white rounded-md py-3 transition-colors disabled:opacity-50"
                >
                  {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                </button>

                <p className="text-gray-300 text-sm text-center mt-2">
                  Đã có tài khoản?{" "}
                  <button
                    type="button"
                    className="text-blue-400 hover:underline"
                    onClick={() => setIsLogin(true)}
                  >
                    Đăng nhập
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
