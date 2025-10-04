"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent } from "../../components/ui/card"
import {
  Home,
  Users,
  Film,
  CreditCard,
  Star,
  Search,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react"

const menuItems = [
  { icon: Home, label: "Home", active: false },
  { icon: Users, label: "Users", active: true },
  { icon: Film, label: "Movies", active: false },
  { icon: CreditCard, label: "Accounts", active: false },
  { icon: Star, label: "Movies Reviews", active: false },
]

export function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // ===== NEW: fetch users from API
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const ac = new AbortController()
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/user/admin/count", { signal: ac.signal })
        if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`)
        const data = await res.json()

        const mapped = (Array.isArray(data) ? data : []).map((u) => ({
          id: u.Id,
          username: u.FullName,
          email: u.Email,
          status: u.isDeleted ? "Inactive" : "Active",
          createdAt: u.CreatedAt,
          updatedAt: u.UpdatedAt,
        }))

        setUsers(mapped)
        setCurrentPage(1)
      } catch (e) {
        if (e?.name !== "AbortError") setError(e?.message ?? "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => ac.abort()
  }, [])

  // ===== Filtering / pagination dựa trên dữ liệu từ API
  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return users.filter((user) => {
      const matchesSearch =
        !term ||
        user.username?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.id?.toLowerCase().includes(term)
      const matchesStatus = statusFilter === "all" || user.status?.toLowerCase() === statusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    })
  }, [users, searchTerm, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage))
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r relative">
        <div className="p-6">
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  item.active ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 w-64 p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">A</span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Admin2</div>
              <div className="text-xs text-gray-500">admin@example.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Home className="w-4 h-4" />
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-gray-900">Users</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Apr 17, 2023</span>
          </div>
        </div>

        {/* Filter Section */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Filter</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <Select className="" value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                  <SelectTrigger className={"w-full"}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users Management Table */}
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Users Management</h3>
            </div>

            {/* Loading / Error */}
            {loading && <div className="p-4 text-sm text-gray-500">Loading users…</div>}
            {error && !loading && <div className="p-4 text-sm text-red-600">Error: {error}</div>}

            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Updated At
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">{user.id}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{user.username}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{user.email}</td>
                        <td className="px-4 py-4">
                          <Badge
                            variant={user.status === "Active" ? "default" : "secondary"}
                            className={user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">{user.createdAt}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{user.updatedAt}</td>
                        <td className="px-4 py-4">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="p-1 bg-transparent">
                              <Eye className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button size="sm" variant="outline" className="p-1 bg-transparent">
                              <Edit className="w-4 h-4 text-purple-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedUsers.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Rows per page:</span>
                <Select
                  className={"w-16"}
                  value={rowsPerPage.toString()}
                  onValueChange={(value) => {
                    setRowsPerPage(Number(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-16">
                    <SelectValue placeholder="Select rows per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {filteredUsers.length === 0
                    ? "0-0 of 0"
                    : `${startIndex + 1}-${Math.min(startIndex + rowsPerPage, filteredUsers.length)} of ${
                        filteredUsers.length
                      }`}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
};

export default UsersManagement;
