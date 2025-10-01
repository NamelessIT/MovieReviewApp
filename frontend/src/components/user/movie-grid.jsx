import { useEffect, useState } from "react"
import { Play, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

/**
 * @typedef {Object} Movie
 * @property {number} id
 * @property {string} title
 * @property {string} image
 * @property {number} year
 * @property {string[]} genre
 */

export function MovieGrid({ title, showViewAll = true }) {
  const [movies, setMovies] = useState([])

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // 1. Fetch all genres (not deleted)
        const genreRes = await fetch("http://localhost:5003/api/genre/all-exist")
        const genreJson = await genreRes.json()
        const allGenres = genreJson.data || []

        // 2. Fetch films by title
        let filmEndpoint = ""
        if (title === "Newest") {
          filmEndpoint = "http://localhost:5003/api/Film/newest"
        } else if (title === "What to watch") {
          filmEndpoint = "http://localhost:5003/api/Film/top-rated"
        }

        const filmRes = await fetch(filmEndpoint)
        const filmJson = await filmRes.json()
        const films = filmJson.data || []

        // 3. For each film, fetch its genres
        const filmsWithGenres = await Promise.all(
          films.map(async (film) => {
            const fgRes = await fetch(`http://localhost:5003/api/FilmGenre/GetByFilmId/${film.id}`)
            const fgJson = await fgRes.json()
            const filmGenres = fgJson.data || []

            // map GenreId -> Name, bỏ qua nếu genre bị ẩn
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
              year: new Date(film.createdAt).getFullYear(),
              genre: genreNames, // array of string
            }
          })
        )

        setMovies(filmsWithGenres)
      } catch (err) {
        console.error("Error fetching movies:", err)
      }
    }

    fetchMovies()
  }, [title])

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          {showViewAll && (
            <Button variant="outline" size="sm">
              View All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 ">
          {movies.map((movie) => (
            <Card
              key={movie.id}
              className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 text-white cursor-pointer"
            >
              <div className="relative">
                <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="w-full h-72 object-cover" />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-white text-white hover:bg-white/10">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center space-x-1 mb-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-white font-medium">8.0</span>
                </div>
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{movie.title}</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{movie.year}</span>
                  <span>{movie.genre.join(", ")}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MovieGrid
