import { Search, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="bg-background border-b border-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground text-White">SuggestFilm</h1>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-foreground hover:text-primary transition-colors text-Orange text-White text-normal">
            Home
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-Orange text-White text-normal">
            Movies
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-Orange text-White text-normal">
            TV Shows
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-Orange text-White text-normal">
            Genres
          </a>
        </nav>

        {/* Search and User */}
        <div className="flex items-center space-x-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground Left-0" />
            <Input placeholder="Search movies..." className="pl-10 w-64 bg-secondary border-border" />
          </div>
          <Button variant="ghost" size="sm" className="background-normal background-Orange">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
