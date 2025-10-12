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
  const moviesPerPage = 5

  const totalPages = Math.ceil(allMovies.length / moviesPerPage)
  const startIndex = (currentPage - 1) * moviesPerPage
  const endIndex = startIndex + moviesPerPage
  const currentMovies = allMovies.slice(startIndex, endIndex)

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)
      try {
        // 1️⃣ Lấy toàn bộ genres chưa bị ẩn
        const genreRes = await axios.get("http://localhost:5003/api/genre/all-exist")
        const allGenres = genreRes.data.data || []

        // 2️⃣ Chọn endpoint theo tiêu đề
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

        // 3️⃣ Map từng film và gắn genre name
        const filmsWithGenres = await Promise.all(
          films.map(async (film) => {
            const fgRes = await axios.get(`http://localhost:5003/api/FilmGenre/GetByFilmId/${film.id}`)
            const filmGenres = fgRes.data.data || []

            const genreNames = filmGenres
              .map((fg) => {
                const g = allGenres.find((gg) => gg.id === fg.genreId && !gg.isDeleted)
                return g ? g.name : null
              })
              .filter(Boolean)

            return {
              id: film.id,
              title: film.title,
              image: film.posterUrl,
              synopsis:film.Synopsis,
              year: new Date(film.createdAt).getFullYear(),
              genre: genreNames,
            }
          })
        )

        setAllMovies(filmsWithGenres)
      } catch (err) {
        console.error("Error fetching movies:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [title])

  const goToPage = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
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
                  <div className=" flex space-x-2">
                    <Button size="sm" className="bg-primary hover:bg-primary/90 btn-play  movieGrid px-4">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 bg-transparent btn-plus movieGrid"
                    >
                      <Plus className="h-4 w-4 color-black-hover" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center space-x-1 mb-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-white font-medium">8.0</span>
                </div>
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
