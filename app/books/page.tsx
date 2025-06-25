"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import BookCard from "@/components/BookCard"
import AddBookForm from "@/components/AddBookForm"
import EditBookForm from "@/components/EditBookForm"

interface Book {
  _id: string
  title: string
  author: string
  price: number
  stock: number
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([])
  const [user, setUser] = useState<any>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token) {
      router.push("/login")
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }

    fetchBooks()
  }, [router])

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/books", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setBooks(data)
      } else {
        setError("Failed to fetch books")
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  const handleAddBook = async (bookData: any) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      })

      if (response.ok) {
        fetchBooks()
        setShowAddForm(false)
      } else {
        setError("Failed to add book")
      }
    } catch (err) {
      setError("Network error")
    }
  }

  const handleEditBook = async (id: string, bookData: any) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      })

      if (response.ok) {
        fetchBooks()
        setEditingBook(null)
      } else {
        setError("Failed to update book")
      }
    } catch (err) {
      setError("Network error")
    }
  }

  const handleDeleteBook = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`/api/books/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          fetchBooks()
        } else {
          setError("Failed to delete book")
        }
      } catch (err) {
        setError("Network error")
      }
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Books Collection</h2>
          {user?.role === "admin" && !showAddForm && !editingBook && (
            <button className="btn btn-success" onClick={() => setShowAddForm(true)}>
              Add New Book
            </button>
          )}
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {showAddForm && (
          <div className="mb-4">
            <AddBookForm onSubmit={handleAddBook} onCancel={() => setShowAddForm(false)} />
          </div>
        )}

        {editingBook && (
          <div className="mb-4">
            <EditBookForm book={editingBook} onSubmit={handleEditBook} onCancel={() => setEditingBook(null)} />
          </div>
        )}

        <div className="row">
          {books.length === 0 ? (
            <div className="col-12 text-center">
              <p>No books available.</p>
            </div>
          ) : (
            books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                isAdmin={user?.role === "admin"}
                onEdit={setEditingBook}
                onDelete={handleDeleteBook}
              />
            ))
          )}
        </div>
      </div>
    </>
  )
}
