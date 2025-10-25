import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Menu, User, Film, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardFilm } from "@/components/ui/CardFilm"
import axios from "axios"

export function Header() {
  const navigate = useNavigate()
  const [searchKeyword, setSearchKeyword] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [username, setUsername] = useState("")
  const dropdownRef = useRef(null)
  const userMenuRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // ✅ Lấy username từ localStorage khi load Header
  useEffect(() => {
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) setUsername(storedUsername)
  }, [])

  // ✅ Ẩn dropdown hoặc user menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        userMenuRef.current && !userMenuRef.current.contains(event.target)
      ) {
        setShowDropdown(false)
        setShowUserMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // ✅ Debounce 400ms khi nhập
  const handleChange = (e) => {
    const keyword = e.target.value
    setSearchKeyword(keyword)
    clearTimeout(typingTimeoutRef.current)

    if (keyword.trim().length === 0) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleSearch(keyword)
    }, 400)
  }

  // ✅ Gọi API tìm kiếm
  const handleSearch = async (keyword) => {
    setIsSearching(true)
    setShowDropdown(true)
    try {
      const res = await axios.get(`http://localhost:5003/api/film/search/${keyword}`)
      const data = res.data.data || []
      const formatted = data.map((f) => ({
        id: f.id,
        title: f.title,
        image: f.posterUrl,
        synopsis: f.synopsis,
      }))
      setSearchResults(formatted)
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // ✅ Khi click card film
  const handleCardClick = (movie) => {
    window.location.href = `/user/movie/${movie.id}`
    setShowDropdown(false)
  }

  // ✅ Khi click icon user
  const handleUserClick = () => {
    setShowUserMenu(!showUserMenu)
  }

  // ✅ Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("accountId")
    navigate("/auth")
  }

  return (
    <header className="bg-background border-b border-border px-4 py-3 relative header-user">
      <div className="max-w-7xl mx-auto flex items-center justify-between header-flex">

        {/* Logo */}
        <div className="flex items-center space-x-4">
          <h1 
            className="text-xl font-bold text-foreground cursor-pointer"
            onClick={() => navigate("/user/homepage")}
          >
            SuggestFilm
          </h1>
          <Button 
            variant="ghost" 
            size="sm" 
            className="header-menu-btn"
            onClick={() => navigate("/user/movies")}
          >
            <Film className="h-5 w-5 mr-2" />
            <span className="hidden md:inline">Danh sách phim</span>
          </Button>
        </div>

        {/* Search */}
        <div className="relative hidden sm:block flex-1 mx-6" ref={dropdownRef}>
          <div className="flex items-center">
            <div className="relative flex-1">
              <Input
                placeholder="Search movies..."
                className="pl-10 w-full bg-secondary border-border"
                value={searchKeyword}
                onChange={handleChange}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Kết quả tìm kiếm */}
          {showDropdown && (
            <div
              className="absolute left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
              style={{
                position: "fixed",
                top: "64px",
                left: 0,
                width: "100vw",
                marginTop: "0",
              }}
            >
              {isSearching ? (
                <div className="p-4 text-center text-muted-foreground">Loading...</div>
              ) : searchResults.length > 0 ? (
                <div className="py-2 max-w-6xl mx-auto">
                  {searchResults.map((film) => (
                    <CardFilm key={film.id} movie={film} onClick={handleCardClick} />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">No results found</div>
              )}
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleUserClick}>
            <User className="h-5 w-5" />
            {username && (
              <span className="text-sm font-medium text-foreground hidden sm:inline">
                {username}
              </span>
            )}
          </div>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-background rounded-lg shadow-md z-50">
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-start px-3 py-2 text-red-500 hover:bg-red-100 logout"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}
