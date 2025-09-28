import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/**
 * @typedef {Object} Celebrity
 * @property {number} id
 * @property {string} name
 * @property {string} role
 * @property {string} image
 */

const celebrities = [
  { id: 1, name: "Scarlett Johansson", role: "Actress", image: "/professional-headshot.png" },
  { id: 2, name: "Zendaya", role: "Actress", image: "/professional-headshot.png" },
  { id: 3, name: "Timothée Chalamet", role: "Actor", image: "/professional-headshot.png" },
  { id: 4, name: "Robert Pattinson", role: "Actor", image: "/professional-headshot.png" },
  { id: 5, name: "Tom Cruise", role: "Actor", image: "/professional-headshot.png" },
]

export function CelebritiesSection() {
  return (
    <section className="py-12 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground text-White">Celebrities</h2>
          <Button variant="outline" size="sm" className="view-all-button">
            View All
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {celebrities.map((celebrity) => (
            <Card
              key={celebrity.id}
              className="text-center p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 background-black text-white cursor-pointer"
            >
              <div className="mb-4">
                <img
                  src={celebrity.image || "/placeholder.svg"}
                  alt={celebrity.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover w-full image-celebrities"
                />
              </div>
              <h3 className="font-semibold text-card-foreground text-sm mb-1">{celebrity.name}</h3>
              <p className="text-xs text-muted-foreground">{celebrity.role}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CelebritiesSection