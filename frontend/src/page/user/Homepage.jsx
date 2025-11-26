import { useState } from "react"
import { Header } from "../../components/user/header"
import { useNavigate } from "react-router-dom"
import { HeroSection } from "../../components/user/hero-section"
import { MovieGrid } from "../../components/user/movie-grid"
import { CelebritiesSection } from "../../components/user/celebrities-section"
import { Footer } from "../../components/user/footer"
import useAuthCheck from "@/hooks/useAuthCheck"
import { Button } from "@/components/ui/button"

export default function Home() {
    useAuthCheck() // ✅ Tự động kiểm tra login
  const navigate = useNavigate()

  const [favoritesUpdated, setFavoritesUpdated] = useState(0)

  const handleFavoritesChange = () => {
    setFavoritesUpdated(Date.now()) // ⚡ trigger refresh toàn bộ
  }

  return (
      <div className="min-h-screen bg-background">
        <Header />
        <HeroSection 
          favoritesUpdated={favoritesUpdated}
          onFavoritesChange={handleFavoritesChange}
        />
      <div className="w-full flex justify-end px-6 mt-4 mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="view-all-button bg-transparent border-white text-white hover:bg-white hover:text-black"
          onClick={() => navigate("/user/movies")}
        >
          View All
        </Button>
      </div>
      <MovieGrid 
        title="What to watch" 
        favoritesUpdated={favoritesUpdated}
        onFavoritesChange={handleFavoritesChange}
      />
      <CelebritiesSection numberSize={5}/>
      <MovieGrid 
        title="Newest" 
        showViewAll={true} 
        favoritesUpdated={favoritesUpdated}
        onFavoritesChange={handleFavoritesChange}
      />
      <MovieGrid 
        title="Favorites" 
        favoritesUpdated={favoritesUpdated}
        onFavoritesChange={handleFavoritesChange}
      />
      <Footer />
    </div>
  )
}
