import { useState, useEffect } from "react"
import axios from "axios"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/**
 * @typedef {Object} Celebrity
 * @property {number} id
 * @property {string} name
 * @property {string} image
 */

export function CelebritiesSection() {
  const [celebrities, setCelebrities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await axios.get("http://localhost:5003/api/actor")

        const actorsData = (response.data?.data || response.data || [])
          .filter((actor) => !actor.isDeleted)
          .map((actor) => ({
            id: actor.id,
            name: actor.name,
            image: actor.image || "/professional-headshot.png", // Ảnh mặc định
          }))

        setCelebrities(actorsData)
      } catch (error) {
        console.error("Error fetching actors:", error)
        setCelebrities([])
      } finally {
        setLoading(false)
      }
    }

    fetchActors()
  }, [])

  return (
    <section className="py-12 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground text-White">Celebrities</h2>
          <Button variant="outline" size="sm" className="view-all-button">
            View All
          </Button>
        </div>

        {/* Loading / Empty / Data */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading celebrities...</div>
        ) : celebrities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No celebrities found.</div>
        ) : (
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
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default CelebritiesSection
