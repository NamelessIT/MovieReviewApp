import React from "react"

export function CardFilm({ movie, onClick }) {
  return (
    <div
      className="flex items-start gap-3 p-3 hover:bg-secondary cursor-pointer transition-colors"
      onClick={() => onClick?.(movie)}
    >
      <img
        src={movie.image || "/placeholder.svg"}
        alt={movie.title}
        className="w-12 h-16 object-cover rounded"
      />
      <div className="flex-1">
        <p className="font-semibold text-foreground text-sm">{movie.title}</p>
        {movie.synopsis && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{movie.synopsis}</p>
        )}
      </div>
    </div>
  )
}
