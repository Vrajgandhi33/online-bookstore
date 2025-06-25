"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link href="/books" className="navbar-brand">
          📚 Online Bookstore
        </Link>

        <div className="navbar-nav ms-auto d-flex flex-row align-items-center">
          {user ? (
            <>
              <span className="navbar-text me-3">
                Welcome, {user.email}
                <span className={`ms-2 ${user.role === "admin" ? "admin-badge" : "user-badge"}`}>{user.role}</span>
              </span>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <div className="d-flex gap-2">
              <Link href="/login" className="btn btn-outline-light btn-sm">
                Login
              </Link>
              <Link href="/signup" className="btn btn-light btn-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
