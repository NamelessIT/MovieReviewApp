import { useState, useRef, useEffect } from "react"
import { Search, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardFilm } from "@/components/ui/CardFilm"
import axios from "axios"

export function Header() {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Ẩn dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Xử lý tìm kiếm (debounce 400ms)
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

  const handleCardClick = (movie) => {
    // TODO: navigate(`/film/${movie.id}`) nếu bạn có router
    console.log("Clicked movie:", movie)
    setShowDropdown(false)
  }
  return (
    <header className="bg-background border-b border-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center header-flex">
        {/* Logo */}
        <div className="flex items-center space-x-4 header">
          <h1 className="text-xl font-bold text-foreground text-White">SuggestFilm</h1>
          <Button variant="ghost" size="sm" className=" header-menu-btn">
            <Menu className="h-5 w-5" />
          </Button>
        </div>  


        {/* Search and User */}
        <div className="flex items-center space-x-3">
          <div className="relative hidden sm:block" ref={dropdownRef}>
            <div className="flex items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground header-svg" />
                <Input
                  placeholder="Search movies..."
                  className="pl-10 w-64 bg-secondary border-border header-input-width"
                  value={searchKeyword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {showDropdown && (
              <div
                className="absolute left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
                style={{
                  position: "fixed",          // ✅ Cố định theo màn hình, không bị giới hạn trong header
                  top: "64px",                // ✅ Nếu header cao 64px (tuỳ bạn chỉnh)
                  left: 0,
                  width: "100vw",             // ✅ Full chiều ngang trình duyệt
                  marginTop: "0",             // Xoá margin-top cũ
                }}
              >
                {isSearching ? (
                  <div className="p-4 text-center text-muted-foreground">Loading...</div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2 max-w-6xl mx-auto"> {/* ✅ Giới hạn nội dung ở giữa */}
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
        </div>

          <Button variant="ghost" size="sm" className="background-normal background-Orange flex ">
            <User className="h-5 w-5" />
          </Button>
      </div>
    </header>
  )
}
