import { Play, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

/**
 * @typedef {Object} Movie
 * @property {number} id
 * @property {string} title
 * @property {string} image
 * @property {string} year
 * @property {string} genre
 */

const movies = [
  { id: 1, title: "Avatar: The Way of Water", image: "/avatar-blue-alien-movie-poster.png", year: "2022", genre: "Sci-Fi" },
  {
    id: 2,
    title: "Black Panther: Wakanda Forever",
    image: "/black-panther-superhero-movie-poster.png",
    year: "2022",
    genre: "Action",
  },
  { id: 3, title: "Dune", image: "/dune-desert-sci-fi-movie-poster.png", year: "2021", genre: "Sci-Fi" },
  { id: 4, title: "No Time to Die", image: "/james-bond-action-movie-poster.png", year: "2021", genre: "Action" },
  { id: 5, title: "Top Gun: Maverick", image: "/top-gun-fighter-jet-movie-poster.png", year: "2022", genre: "Action" },
]

/**
 * @typedef {Object} MovieGridProps
 * @property {string} title
 * @property {boolean} [showViewAll]
 */

export function MovieGrid({ title, showViewAll = true }) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground text-White">{title}</h2>
          {showViewAll && (
            <Button variant="outline" size="sm" className="view-all-button">
              View All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 ">
          {movies.map((movie) => (
            <Card
              key={movie.id}
              className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 background-black text-white cursor-pointer"
            >
              <div className="relative">
                <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="w-full h-72 object-cover" />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 bg-transparent"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-card-foreground text-sm mb-1 line-clamp-2">{movie.title}</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{movie.year}</span>
                  <span>{movie.genre}</span>
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