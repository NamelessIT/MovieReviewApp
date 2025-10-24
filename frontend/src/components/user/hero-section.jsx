import { useState, useEffect } from "react"
import axios from "axios"
import { Play, Star, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

export function HeroSection() {
  const navigate = useNavigate()
  const [film, setFilm] = useState(null)
  const [genres, setGenres] = useState([])
  const [isFavorite, setIsFavorite] = useState(false) // giữ nguyên tên trạng thái
  const currentAccountId = 1 // tạm thời cố định user id

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Lấy danh sách film có rating cao nhất
        const ratingRes = await axios.get("http://localhost:5003/api/Review/admin/GetAverageRatings")
        const ratingData = ratingRes?.data?.data || []
        if (ratingData.length === 0) return
        const topFilm = ratingData[0]
        const filmId = topFilm.movieId

        // 2️⃣ Lấy chi tiết film
        const filmRes = await axios.get(`http://localhost:5003/api/film/admin/${filmId}`)
        // backend có thể trả { data: film } hoặc film trực tiếp; chuẩn là response.data.data
        const filmData = filmRes?.data?.data ?? filmRes?.data ?? null
        if (!filmData) {
          console.warn("Film data empty for id:", filmId)
          return
        }

        // 3️⃣ Lấy danh sách thể loại và chuyển id -> name
        const filmGenreRes = await axios.get(`http://localhost:5003/api/FilmGenre/GetByFilmId/${filmId}`)
        const allGenreRes = await axios.get("http://localhost:5003/api/genre")
        const filmGenres = filmGenreRes?.data?.data || []
        const allGenres = allGenreRes?.data?.data || []

        const genreNames = filmGenres
          .map((fg) => {
            const match = allGenres.find((g) => g.id === fg.genreId && !g.isDeleted)
            return match ? match.name : null
          })
          .filter(Boolean)

        // 4️⃣ Kiểm tra trạng thái favorites hiện tại (GET review cho account-film)
        try {
          const reviewRes = await axios.get(
            `http://localhost:5003/api/Review/account/${currentAccountId}/film/${filmId}`
          )
          const reviewData = reviewRes?.data?.data
          setIsFavorite(Boolean(reviewData?.favorites))
        } catch (err) {
          // Nếu 404 (chưa có review) -> chưa favorite; nếu lỗi khác thì log
          if (err.response?.status === 404) {
            setIsFavorite(false)
          } else {
            console.warn("Lỗi khi kiểm tra favorites:", err?.message ?? err)
            setIsFavorite(false)
          }
        }

        // 5️⃣ Set film + genres + averageRating
        setFilm({
          ...filmData,
          averageRating: topFilm.averageRating ?? 0,
        })
        setGenres(genreNames)
      } catch (err) {
        console.error("❌ Error fetching film data:", err)
      }
    }

    fetchData()
  }, [])

  // đi tới trang chi tiết phim (khi bấm Watch)
  const handlePlayClick = (movie, e) => {
    e?.stopPropagation()
    if (!movie?.id) return
    navigate(`/user/movie/${movie.id}`)
  }

  // Toggle favorites: gọi API CreateFavorites (tạo hoặc cập nhật)
  const handleFavoriteToggle = async (e) => {
    e?.stopPropagation()
    if (!film?.id) return

    const newStatus = !isFavorite
    // optimistic update UI nhưng rollback nếu lỗi
    setIsFavorite(newStatus)

    try {
      await axios.post("http://localhost:5003/api/Review/CreateFavorites", {
        accountId: currentAccountId,
        filmId: film.id,
        favorites: newStatus,
      })

      Swal.fire({
        icon: "success",
        title: newStatus ? "Đã thêm vào danh sách yêu thích" : "Đã xóa khỏi danh sách yêu thích",
        timer: 1300,
        showConfirmButton: false,
      })
    } catch (err) {
      console.error("❌ Error toggling favorite:", err)
      setIsFavorite(!newStatus) // revert
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể cập nhật danh sách yêu thích",
      })
    }
  }

  if (!film) {
    return (
      <section className="relative hero-gradient min-h-[500px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center display-flex">
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <div className="w-72 h-48 rounded-lg bg-gray-800 animate-pulse" />
            </div>
          </div>
          <div className="lg:text-left space-y-6">
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-black/20 text-white background-opacity-40">
                ...
              </Badge>
              <h2 className="text-5xl font-bold text-white">Loading...</h2>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative hero-gradient min-h-[500px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center display-flex">
        {/* Movie Poster */}
        <div className="flex justify-center lg:justify-start">
          <div className="relative">
            <img
              src={film.posterUrl || "/dune-movie-poster-with-desert-landscape-and-charac.png"}
              alt={film.title}
              className="rounded-lg shadow-2xl w-72 h-auto"
            />
          </div>
        </div>

        {/* Movie Info */}
        <div className=" lg:text-left space-y-6">
          <div className="space-y-2">
            <Badge variant="secondary" className="bg-black/20 text-white background-opacity-40">
              {film.releaseDate ? new Date(film.releaseDate).getFullYear() : "NEW"}
            </Badge>

            <h2 className="text-5xl font-bold text-white">{film.title}</h2>
            <div className="flex items-center justify-center lg:justify-start space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-white font-medium">
                  {film.averageRating && film.averageRating > 0 ? film.averageRating.toFixed(1) : ""}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-white">{genres.length > 0 ? genres.join(", ") : "Unknown Genre"}</span>
              </div>
            </div>
          </div>

          <p className="text-white/90 text-lg max-w-md mx-auto lg:mx-0">
            {film.synopsis || "No synopsis available."}
          </p>

          <div className="flex items-center justify-center lg:justify-start space-x-4">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 Watch-Trailer-Btn"
              onClick={(e) => handlePlayClick(film, e)}
            >
              <Play className="h-5 w-5 mr-2 display-inline" />
              Watch Now
            </Button>

            <Button
              variant="outline"
              size="lg"
              className={`border-white text-white hover:bg-white/10 bg-transparent add-to-list ${
                isFavorite ? "bg-red-600 border-red-600" : ""
              }`}
              onClick={handleFavoriteToggle}
            >
              {isFavorite ? "Remove Favourites List" : "Add to Favourites List"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
