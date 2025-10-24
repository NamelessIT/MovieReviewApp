import { useState } from "react"
import { Header } from "../../components/user/header"
import { HeroSection } from "../../components/user/hero-section"
import { MovieGrid } from "../../components/user/movie-grid"
import { CelebritiesSection } from "../../components/user/celebrities-section"
import { Footer } from "../../components/user/footer"
import useAuthCheck from "@/hooks/useAuthCheck"

export default function Home() {
    useAuthCheck() // ✅ Tự động kiểm tra login

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
      <MovieGrid 
        title="What to watch" 
        favoritesUpdated={favoritesUpdated}
        onFavoritesChange={handleFavoritesChange}
      />
      <CelebritiesSection />
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
