import { Play, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative hero-gradient min-h-[500px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center display-flex">
        {/* Movie Poster */}
        <div className="flex justify-center lg:justify-start">
          <div className="relative">
            <img
              src="/dune-movie-poster-with-desert-landscape-and-charac.png"
              alt="Dune Movie Poster"
              className="rounded-lg shadow-2xl w-72 h-auto"
            />
          </div>
        </div>

        {/* Movie Info */}
        <div className=" lg:text-left space-y-6">
          <div className="space-y-2">
            <Badge variant="secondary" className="bg-black/20 text-white background-opacity-40">
              IT BEGINS
            </Badge>
            <h2 className="text-5xl font-bold text-white">Dune</h2>
            <div className="flex items-center justify-center lg:justify-start space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-white font-medium">8.0</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-white">PG-13</span>
              </div>
            </div>
          </div>

          <p className="text-white/90 text-lg max-w-md mx-auto lg:mx-0">
            A noble family becomes embroiled in a war for control over the galaxy's most valuable asset.
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

      {/* Pagination dots */}
      {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <div className="w-3 h-3 rounded-full bg-white"></div>
        <div className="w-3 h-3 rounded-full bg-white/50"></div>
        <div className="w-3 h-3 rounded-full bg-white/50"></div>
        <div className="w-3 h-3 rounded-full bg-white/50"></div>
        <div className="w-3 h-3 rounded-full bg-white/50"></div>
      </div> */}
    </section>
  )
}

export default HeroSection