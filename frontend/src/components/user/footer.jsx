import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-footer py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground text-White">SuggestFilm</h3>
            <p className="text-sm text-muted-foreground">
              A website that helps you find the right movie based on your mood and taste.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-White ">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="link-footer text-muted-foreground hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="link-footer text-muted-foreground hover:text-primary transition-colors">
                  Movies
                </a>
              </li>
              <li>
                <a href="#" className="link-footer text-muted-foreground hover:text-primary transition-colors">
                  TV Shows
                </a>
              </li>
              <li>
                <a href="#" className="link-footer text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-White">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Email: contact@suggestfilm.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>

          {/* Connect With Us */}
          <div className="connect-footer space-y-4">
            <h4 className="font-semibold text-foreground text-White text-AlignCenter">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="icon-footer text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="icon-footer text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="icon-footer text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="icon-footer text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">© 2025 Movie Suggestions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer