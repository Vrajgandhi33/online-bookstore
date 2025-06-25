"use client"

interface Book {
  _id: string
  title: string
  author: string
  price: number
  stock: number
}

interface BookCardProps {
  book: Book
  isAdmin: boolean
  onEdit: (book: Book) => void
  onDelete: (id: string) => void
}

export default function BookCard({ book, isAdmin, onEdit, onDelete }: BookCardProps) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card book-card h-100">
        <div className="card-body">
          <h5 className="card-title">{book.title}</h5>
          <p className="card-text">
            <strong>Author:</strong> {book.author}
            <br />
            <strong>Price:</strong> ${book.price}
            <br />
            <strong>Stock:</strong> {book.stock}
          </p>
          {isAdmin && (
            <div className="d-flex gap-2">
              <button className="btn btn-warning btn-sm" onClick={() => onEdit(book)}>
                Edit
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(book._id)}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
