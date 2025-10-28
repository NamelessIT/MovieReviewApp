import { useState, useEffect } from "react"
import axios from "axios"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

/**
 * @typedef {Object} Celebrity
 * @property {number} id
 * @property {string} name
 * @property {string} image
 */

export function CelebritiesSection({ numberSize = 5 }) {
  const [celebrities, setCelebrities] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  // ✅ Fetch dữ liệu diễn viên
  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await axios.get("http://localhost:5003/api/actor")

        const actorsData = (response.data?.data || response.data || [])
          .filter((actor) => !actor.isDeleted)
          .map((actor) => ({
            id: actor.id,
            name: actor.name,
            image: actor.image || "/professional-headshot.png",
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

  // ✅ Tính toán phân trang
  const totalPages = Math.ceil(celebrities.length / numberSize)
  const startIndex = (currentPage - 1) * numberSize
  const currentCelebrities = celebrities.slice(startIndex, startIndex + numberSize)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const goToPrevious = () => goToPage(currentPage - 1)
  const goToNext = () => goToPage(currentPage + 1)

  // ✅ UI render
  return (
    <section className="py-12 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground text-White">Celebrities</h2>
        </div>

        {/* Loading / Empty / Data */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading celebrities...</div>
        ) : celebrities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No celebrities found.</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {currentCelebrities.map((celebrity) => (
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

            {/* ✅ Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 pagenation">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  className="disabled:opacity-50 bg-transparent active"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className={currentPage === page ? "bg-primary text-primary-foreground active" : ""}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className="disabled:opacity-50 bg-transparent"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default CelebritiesSection
