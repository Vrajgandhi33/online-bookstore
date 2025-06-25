"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface Book {
  _id: string
  title: string
  author: string
  price: number
  stock: number
}

interface EditBookFormProps {
  book: Book
  onSubmit: (id: string, bookData: any) => void
  onCancel: () => void
}

export default function EditBookForm({ book, onSubmit, onCancel }: EditBookFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    stock: "",
  })

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        price: book.price.toString(),
        stock: book.stock.toString(),
      })
    }
  }, [book])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(book._id, {
      ...formData,
      price: Number.parseFloat(formData.price),
      stock: Number.parseInt(formData.stock),
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5>Edit Book</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Author</label>
            <input
              type="text"
              className="form-control"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Price</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Stock</label>
            <input
              type="number"
              className="form-control"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              Update Book
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
