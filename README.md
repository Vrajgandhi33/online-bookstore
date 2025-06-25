# Online Bookstore Application

A full-stack application for managing an online bookstore, with authentication and book management features.

## Technologies Used

- **Frontend**:

  - Next.js with TypeScript
  - React for UI components
  - Shadcn UI components

- **Backend**:
  - Node.js with Express
  - MongoDB for database
  - JWT for authentication

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- MongoDB instance (local or cloud-based MongoDB Atlas)

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   ```

3. Configure environment variables:

   - Create/update `.env` file in the root directory with:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:5000/api
     ```
   - Create/update `.env` file in the `backend` directory with:
     ```
     MONGO_URI=<your_mongodb_uri>
     JWT_SECRET=<your_secret_key>
     PORT=5000
     ```

4. Seed the database with initial data:
   ```bash
   npm run seed
   ```

### Running the Application

#### Development Mode

Run both frontend and backend simultaneously:

```bash
npm run dev:full
```

Or run them separately:

```bash
# Frontend (http://localhost:3000)
npm run dev

# Backend (http://localhost:5000)
npm run dev:backend
```

#### Production Mode

```bash
# Build the frontend
npm run build

# Run the frontend
npm start

# Run the backend
npm run start:backend
```

## User Credentials

The application comes with pre-seeded users:

- Admin user:

  - Email: `admin@test.com`
  - Password: `admin123`

- Regular user:
  - Email: `user@test.com`
  - Password: `user123`

## Features

- User authentication (signup, login)
- Book browsing for authenticated users
- Admin features:
  - Add new books
  - Edit existing books
  - Delete books

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create a new user
- `POST /api/auth/login` - Log in an existing user

### Books

- `GET /api/books` - Get all books (authenticated)
- `POST /api/books` - Create a new book (admin only)
- `PUT /api/books/:id` - Update a book (admin only)
- `DELETE /api/books/:id` - Delete a book (admin only)
