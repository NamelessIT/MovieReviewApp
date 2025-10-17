import { useEffect, useState } from "react"
import { Play, Plus, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import axios from "axios"

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

export function MovieGrid({ title, showViewAll = true }) {
  const [allMovies, setAllMovies] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState({}) // ✅ trạng thái lưu phim nào đã thêm vào favorites
  const moviesPerPage = 5

  const totalPages = Math.ceil(allMovies.length / moviesPerPage)
  const startIndex = (currentPage - 1) * moviesPerPage
  const endIndex = startIndex + moviesPerPage
  const currentMovies = allMovies.slice(startIndex, endIndex)

useEffect(() => {
  const fetchMovies = async () => {
    setLoading(true)
    try {
      // 1️⃣ Lấy danh sách genre chưa bị ẩn
      const genreRes = await axios.get("http://localhost:5003/api/genre/all-exist")
      const allGenres = genreRes.data.data || []

      // 2️⃣ Lấy rating trung bình của phim
      const ratingRes = await axios.get("http://localhost:5003/api/Review/admin/GetAverageRatings")
      const ratingData = ratingRes?.data?.data || [] // mảng { movieId, title, averageRating }

      // 3️⃣ Chọn endpoint phim
      let filmEndpoint = ""
      if (title === "Newest") {
        filmEndpoint = "http://localhost:5003/api/Film/newest"
      } else if (title === "What to watch") {
        filmEndpoint = "http://localhost:5003/api/Film/top-rated"
      }

      const filmRes = await axios.get(filmEndpoint)
      let films = filmRes.data.data || []

      // Nếu top-rated rỗng → fallback sang newest
      if (title === "What to watch" && films.length === 0) {
        const fallback = await axios.get("http://localhost:5003/api/Film/newest")
        films = fallback.data.data || []
      }

      // 4️⃣ Gắn genre + rating vào từng film
      const filmsWithDetails = await Promise.all(
        films.map(async (film) => {
          // Lấy danh sách thể loại theo film
          const fgRes = await axios.get(`http://localhost:5003/api/FilmGenre/GetByFilmId/${film.id}`)
          const filmGenres = fgRes.data.data || []

          const genreNames = filmGenres
            .map((fg) => {
              const g = allGenres.find((gg) => gg.id === fg.genreId && !gg.isDeleted)
              return g ? g.name : null
            })
            .filter(Boolean)

          // Lấy rating trung bình từ danh sách ratingData
          const filmRatingObj = ratingData.find((r) => r.movieId === film.id)
          const averageRating = filmRatingObj ? filmRatingObj.averageRating : 0 // ⚡ nếu null → 0

          return {
            id: film.id,
            title: film.title,
            image: film.posterUrl,
            synopsis: film.Synopsis,
            year: new Date(film.createdAt).getFullYear(),
            genre: genreNames,
            trailerUrl: film.trailerUrl || "",
            rating: averageRating, // ✅ thêm rating
          }
        })
      )

      setAllMovies(filmsWithDetails)
    } catch (err) {
      console.error("❌ Error fetching movies:", err)
    } finally {
      setLoading(false)
    }
  }

  fetchMovies()
}, [title])


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
   * Mục tiêu: mở link trailer Youtube (film.trailerUrl)
   * ========================== */
  const handlePlayClick = (movie) => {
    console.log("Play trailer for movie:", movie)
    // 👉 TODO: bạn tự viết code mở trailerUrl
    // Ví dụ:
    // window.open(movie.trailerUrl, "_blank")
  }

  /** ==========================
   * 🧩 HÀM 2: Xử lý khi bấm nút "Add to List"
   * Mục tiêu: gọi API CreateFavorites và đổi icon Plus → Check khi thành công
   * ========================== */
  const handleAddToFavorites = async (movie) => {
    console.log("Add to favorites movie:", movie)
    try {
      // 👉 TODO: bạn tự viết code gọi API
      // const res = await axios.post("http://localhost:5003/api/Review/CreateFavorites", {
      //   accountId: 1,
      //   filmId: movie.id,
      //   favorites: true,
      // })
      // if (res.status === 200) {
      //   setFavorites((prev) => ({ ...prev, [movie.id]: true }))
      // }
    } catch (err) {
      console.error("Error adding to favorites:", err)
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
            <Button variant="outline" size="sm" className="view-all-button">
              View All
            </Button>
          )}
        </div>

        {/* Movie grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 ">
          {currentMovies.map((movie) => (
            <Card
              key={movie.id}
              className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 border-orange background-black "
            >
              <div className="relative">
                <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="w-full h-72 object-cover" />

                {/* Overlay hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center movieGrid ">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 btn-play movieGrid px-4"
                      onClick={() => handlePlayClick(movie)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 bg-transparent btn-plus movieGrid"
                      onClick={() => handleAddToFavorites(movie)}
                    >
                      {favorites[movie.id] ? (
                        <Check className="h-4 w-4 text-green-400" />
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
