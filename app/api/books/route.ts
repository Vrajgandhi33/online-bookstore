import { type NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/app/config/api";

// Replace any hardcoded URLs with API_BASE_URL
// Example: fetch(`${API_BASE_URL}/books`, ...)

function getAuthToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

export async function GET(request: NextRequest) {
  const token = getAuthToken(request);
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Making GET request to books API with token");

    // For development testing only - fallback when backend is down
    if (process.env.NODE_ENV === "development") {
      try {
        console.log(`Requesting books from: ${API_BASE_URL}/books`);
        const response = await fetch(`${API_BASE_URL}/books`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // Add timeout to prevent long wait when server is down
          signal: AbortSignal.timeout(3000),
        });

        if (!response.ok) {
          console.log(`Backend responded with status: ${response.status}`);
          throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (fetchError) {
        console.log("Backend connection failed, using fallback book data");
        console.error(fetchError);

        // Provide mock data when backend is not available
        const mockBooks = [
          {
            _id: "1",
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            price: 12.99,
            stock: 25,
          },
          {
            _id: "2",
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            price: 14.99,
            stock: 30,
          },
          {
            _id: "3",
            title: "1984",
            author: "George Orwell",
            price: 13.99,
            stock: 20,
          },
        ];

        return NextResponse.json(mockBooks);
      }
    } else {
      // Production code path
      const response = await fetch(`${API_BASE_URL}/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { message: "Server error - please check if backend server is running" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const token = getAuthToken(request);
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Making POST request to books API with token");
    const bookData = await request.json();

    // For development testing only - fallback when backend is down
    if (process.env.NODE_ENV === "development") {
      try {
        console.log(`Creating book at: ${API_BASE_URL}/books`);
        const response = await fetch(`${API_BASE_URL}/books`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookData),
          // Add timeout to prevent long wait when server is down
          signal: AbortSignal.timeout(3000),
        });

        if (!response.ok) {
          console.log(`Backend responded with status: ${response.status}`);
          throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (fetchError) {
        console.log("Backend connection failed, using fallback book creation");
        console.error(fetchError);

        // Mock successful book creation
        const newBook = {
          _id: Math.floor(Math.random() * 10000).toString(),
          ...bookData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return NextResponse.json(newBook, { status: 201 });
      }
    } else {
      // Production code path
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json(
      { message: "Server error - please check if backend server is running" },
      { status: 500 }
    );
  }
}
