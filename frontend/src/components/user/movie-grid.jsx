import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Play, Plus, Star, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import axios from "axios"
import Swal from "sweetalert2"

/**
 * @typedef {Object} Movie
 * @property {number} id
 * @property {string} title
 * @property {string} image
 * @property {number} year
 * @property {string[]} genre
 */

/**
 * @typedef {Object} MovieGridProps
 * @property {string} title
 * @property {boolean} [showViewAll]
 */

export function MovieGrid({ title, showViewAll = true ,onFavoritesChange, favoritesUpdated}) {
  const navigate = useNavigate()
  const [allMovies, setAllMovies] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState({}) // ✅ trạng thái lưu phim nào đã thêm vào favorites

  const moviesPerPage = 5

  const totalPages = Math.ceil(allMovies.length / moviesPerPage)
  const startIndex = (currentPage - 1) * moviesPerPage
  const endIndex = startIndex + moviesPerPage
  const currentMovies = allMovies.slice(startIndex, endIndex)
  const currentAccountId = localStorage.getItem("accountId") || 1


useEffect(() => {
  const fetchMovies = async () => {
    setLoading(true)

    try {
      // 1️⃣ Lấy danh sách genre
      const genreRes = await axios.get("http://localhost:5003/api/genre/all-exist")
      const allGenres = genreRes.data.data || []

      // 2️⃣ Lấy rating trung bình
      const ratingRes = await axios.get("http://localhost:5003/api/Review/admin/GetAverageRatings")
      const ratingData = ratingRes?.data?.data || []

      // 3️⃣ Xử lý theo loại MovieGrid
      let films = []

      if (title === "Favorites") {
        // 👉 Lấy danh sách review yêu thích
        const favRes = await axios.get(`http://localhost:5003/api/Review/favorites/${currentAccountId}`)
        const favData = favRes?.data?.data || []

        if (!favData.length) {
          // Không có phim yêu thích → ẩn luôn MovieGrid này
          setAllMovies([])
          setLoading(false)
          return
        }

        // Lấy danh sách ID phim yêu thích
        const favoriteFilmIds = favData.map((f) => f.movieId)

        // Gọi API lấy tất cả phim (để đối chiếu)
        const filmRes = await axios.get("http://localhost:5003/api/film")
        const allFilms = filmRes.data.data || []

        // Lọc phim nằm trong danh sách yêu thích
        films = allFilms.filter((film) => favoriteFilmIds.includes(film.id))
      } else {
        // Các grid khác (Newest / What to watch)
        let filmEndpoint = ""
        if (title === "Newest") {
          filmEndpoint = "http://localhost:5003/api/film/newest"
        } else if (title === "What to watch") {
          filmEndpoint = "http://localhost:5003/api/film/top-rated"
        }

        const filmRes = await axios.get(filmEndpoint)
        films = filmRes.data.data || []

        // Nếu top-rated rỗng → fallback sang newest
        if (title === "What to watch" && films.length === 0) {
          const fallback = await axios.get("http://localhost:5003/api/film/newest")
          films = fallback.data.data || []
        }
      }

      // 4️⃣ Gắn genre, rating, favorites
      const filmsWithDetails = await Promise.all(
        films.map(async (film) => {
          // Genre
          const fgRes = await axios.get(`http://localhost:5003/api/filmGenre/GetByFilmId/${film.id}`)
          const filmGenres = fgRes.data.data || []
          const genreNames = filmGenres
            .map((fg) => {
              const g = allGenres.find((gg) => gg.id === fg.genreId && !gg.isDeleted)
              return g ? g.name : null
            })
            .filter(Boolean)

          // Rating
          const filmRatingObj = ratingData.find((r) => r.movieId === film.id)
          const averageRating = filmRatingObj ? filmRatingObj.averageRating : 0

          // Kiểm tra favorites
          let isFavorite = false
          try {
            const reviewRes = await axios.get(
              `http://localhost:5003/api/Review/account/${currentAccountId}/film/${film.id}`,
                {
                  validateStatus: (status) => status < 500, // ✅ Không throw lỗi nếu 404
                }
            )
            if (reviewRes.status === 200 && reviewRes?.data?.data?.favorites === true) {
              isFavorite = true
            }
          } catch (err) {
            if (err.response?.status !== 404) console.warn("⚠️ Lỗi khi kiểm tra favorites:", err.message)
          }

          return {
            id: film.id,
            title: film.title,
            image: film.posterUrl,
            synopsis: film.Synopsis,
            year: new Date(film.createdAt).getFullYear(),
            genre: genreNames,
            trailerUrl: film.trailerUrl || "",
            rating: averageRating,
            favorites: isFavorite,
          }
        })
      )

      setAllMovies(filmsWithDetails)
      const favMap = {}
      filmsWithDetails.forEach((f) => (favMap[f.id] = f.favorites))
      setFavorites(favMap)
    } catch (err) {
      console.error("❌ Error fetching movies:", err)
    } finally {
      setLoading(false)
    }
  }

  fetchMovies()
}, [title,favoritesUpdated])




  // ✅ Không còn scroll to top khi đổi trang
  const goToPage = (page) => {
    setCurrentPage(page)
  }

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

    /** ==========================
   * 🧩 HÀM 1: Xử lý khi bấm nút "Play"
   * Mục tiêu: chuyển đến trang chi tiết phim
   * ========================== */
  const handlePlayClick = (movie, e) => {
    e.stopPropagation()
    navigate(`/user/movie/${movie.id}`)
  }

  /** ==========================
   * 🧩 HÀM 2: Xử lý khi bấm nút "Add to List"
   * Mục tiêu: gọi API CreateFavorites và đổi icon Plus → Check khi thành công
   * ========================== */
 const handleAddToFavorites = async (movie, e) => {
  e.stopPropagation()

  // 🌀 Lấy trạng thái hiện tại (đã thích hay chưa)
  const currentStatus = favorites[movie.id] || false
  const newStatus = !currentStatus

  // Cập nhật tạm thời trên UI (optimistic update)
  setFavorites((prev) => ({ ...prev, [movie.id]: newStatus }))

  try {
    const res = await axios.post("http://localhost:5003/api/Review/CreateFavorites", {
      accountId: currentAccountId,
      filmId: movie.id,
      favorites: newStatus,
    })

    if (res.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: newStatus
          ? "Đã thêm vào danh sách yêu thích 💖"
          : "Đã xóa khỏi danh sách yêu thích ❌",
        timer: 1500,
        showConfirmButton: false,
      })
    }

      if (onFavoritesChange) onFavoritesChange()


        // ✅ Nếu đang ở trang Favorites thì cập nhật danh sách mà không reload
      if (title === "Favorites") {
        setAllMovies((prevMovies) => {
          if (newStatus) {
            // nếu vừa thêm mới, thêm phim này vào danh sách
            return [...prevMovies, movie]
          } else {
            // nếu vừa bỏ thích, loại bỏ khỏi danh sách
            return prevMovies.filter((m) => m.id !== movie.id)
          }
        })
      }
  } catch (err) {
    console.error("❌ Error toggling favorite:", err)

    // ❗ Revert nếu lỗi
    setFavorites((prev) => ({ ...prev, [movie.id]: currentStatus }))

    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: "Không thể cập nhật danh sách yêu thích!",
      confirmButtonText: "Đóng",
    })
  }
}


  if (loading) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-muted-foreground">Loading movies...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">
            {title} <span className="text-muted-foreground text-lg">({allMovies.length} films)</span>
          </h2>
          {showViewAll && (
            <Button 
              variant="outline" 
              size="sm" 
              className="view-all-button"
              onClick={() => navigate("/user/movies")}
            >
              View All
            </Button>
          )}
        </div>

        {/* Movie grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 ">
          {currentMovies.map((movie) => (
            <Card
              key={movie.id}
              className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 border-orange background-black cursor-pointer"
              onClick={(e) => handlePlayClick(movie, e)}
            >
              <div className="relative">
                <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="w-full h-72 object-cover" />

                {/* Overlay hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center movieGrid ">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 btn-play movieGrid px-4"
                      onClick={(e) => handlePlayClick(movie, e)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => handleAddToFavorites(movie, e)}
                      className={`border-white text-white hover:bg-white/10 bg-transparent btn-plus movieGrid ${
                        favorites[movie.id] ? "bg-green-500 border-green-500" : ""
                      }`}
                    >
                      {favorites[movie.id] ? (
                        <Check className="h-4 w-4 text-white" /> // ✅ Đổi sang dấu tick nếu đã yêu thích
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {movie.rating > 0 && (
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">{movie.rating.toFixed(1)}</span>
                  </div>
                )}
                <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-White" >{movie.title}</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="movieGrid-year">{movie.year}</span>
                  <span className="line-clamp-1 movieGrid-genre-hover">{movie.genre.join(", ")}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className="disabled:opacity-50 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className={currentPage === page ? "bg-primary text-primary-foreground" : ""}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className="disabled:opacity-50 bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

export default MovieGrid
