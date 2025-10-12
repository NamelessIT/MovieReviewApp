import { useState, useEffect } from "react"
import axios from "axios"
import { Play, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  const [film, setFilm] = useState(null)
  const [genres, setGenres] = useState([])

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
        const filmData = filmRes?.data?.data // ⚠️ fix lỗi rỗng ở đây

        // 3️⃣ Lấy danh sách thể loại
        const filmGenreRes = await axios.get(`http://localhost:5003/api/FilmGenre/GetByFilmId/${filmId}`)
        const allGenreRes = await axios.get("http://localhost:5003/api/genre")

        // 4️⃣ Lọc tên thể loại
        const genreNames = (filmGenreRes?.data?.data || []).map(fg => {
          const match = allGenreRes?.data?.data?.find(g => g.id === fg.genreId)
          return match ? match.name : null
        }).filter(Boolean)

        // 5️⃣ Gộp dữ liệu
        setFilm({
          ...filmData,
          averageRating: topFilm.averageRating
        })
        setGenres(genreNames)
      } catch (err) {
        console.error("❌ Error fetching film data:", err)
      }
    }

    fetchData()
  }, [])

  if (!film) {
    return (
      <section className="min-h-[500px] flex justify-center items-center text-white">
        Loading top-rated film...
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
        <div className="lg:text-left space-y-6">
          <div className="space-y-2">
            <Badge variant="secondary" className="bg-black/20 text-white background-opacity-40">
              {film.releaseDate ? new Date(film.releaseDate).getFullYear() : "NEW"}
            </Badge>

            <h2 className="text-5xl font-bold text-white">{film.title}</h2>

            <div className="flex items-center justify-center lg:justify-start space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-white font-medium">
                  {film.averageRating?.toFixed(1) || "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-white">
                  {genres.length > 0 ? genres.join(", ") : "Unknown Genre"}
                </span>
              </div>
            </div>
          </div>

          <p className="text-white/90 text-lg max-w-md mx-auto lg:mx-0">
            {film.synopsis || "No synopsis available."}
          </p>

          <div className="flex items-center justify-center lg:justify-start space-x-4">
            <Button size="lg" className="bg-white text-black hover:bg-white/90 Watch-Trailer-Btn">
              <Play className="h-5 w-5 mr-2 display-inline" />
              Watch Now
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 bg-transparent add-to-list">
              Add to List
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
