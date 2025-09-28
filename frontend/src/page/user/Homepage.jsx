import { Header } from "../../components/user/header"
import { HeroSection } from "../../components/user/hero-section"
import { MovieGrid } from "../../components/user/movie-grid"
import { CelebritiesSection } from "../../components/user/celebrities-section"
import { Footer } from "../../components/user/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <MovieGrid title="What to watch" />
      <CelebritiesSection />
      <MovieGrid title="Newest" showViewAll={true} />
      <Footer />
    </div>
  )
}
