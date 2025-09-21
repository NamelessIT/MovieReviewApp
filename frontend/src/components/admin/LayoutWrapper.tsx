import React from "react"
import Sidebar from "./Sidebar.tsx"
interface LayoutWrapperProps {
    children: React.ReactNode
}

export function LayoutWrapper({children}: LayoutWrapperProps){
    return(
    <div className="d-flex flex-grow-1 flex-shrink-1 w-100 h-100 bg-dark">
      <Sidebar />
      <main className="d-flex flex-column flex-grow-1 flex-shrink-1 w-100">
        <div className="border rounded bg-light p-3 h-100">
        {children}
        </div>
      </main>
    </div>
    )
}