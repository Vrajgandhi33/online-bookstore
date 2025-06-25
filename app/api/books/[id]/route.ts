import { type NextRequest, NextResponse } from "next/server";

// Use 127.0.0.1 instead of localhost to avoid IPv6 issues
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

function getAuthToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = getAuthToken(request);
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    console.log(`Making GET request for book ID: ${id} with token`);

    // For development testing only - fallback when backend is down
    if (process.env.NODE_ENV === "development") {
      try {
        console.log(`Requesting book from: ${API_BASE_URL}/books/${id}`);
        const response = await fetch(`${API_BASE_URL}/books/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // Add timeout to prevent long wait when server is down
          signal: AbortSignal.timeout(3000),
        });

        if (!response.ok) {
          console.log(`Backend responded with status: ${response.status}`);
          if (response.status === 404) {
            return NextResponse.json(
              { message: "Book not found" },
              { status: 404 }
            );
          }
          throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (fetchError) {
        console.log("Backend connection failed, using fallback book data");

        // Provide mock data when backend is not available
        const mockBook = {
          _id: id,
          title: "Sample Book",
          author: "Sample Author",
          price: 19.99,
          stock: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return NextResponse.json(mockBook);
      }
    } else {
      // Production code path
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { message: "Server error - please check if backend server is running" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = getAuthToken(request);
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const bookData = await request.json();

    // For development testing only - fallback when backend is down
    if (process.env.NODE_ENV === "development") {
      try {
        const response = await fetch(`${API_BASE_URL}/books/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookData),
          // Add timeout to prevent long wait when server is down
          signal: AbortSignal.timeout(3000),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (fetchError) {
        console.log("Backend connection failed, using fallback book update");

        // Mock successful book update
        const updatedBook = {
          _id: id,
          ...bookData,
          updatedAt: new Date().toISOString(),
        };

        return NextResponse.json(updatedBook);
      }
    } else {
      // Production code path
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: "PUT",
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
    console.error("Error updating book:", error);
    return NextResponse.json(
      { message: "Server error - please check if backend server is running" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = getAuthToken(request);
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    // For development testing only - fallback when backend is down
    if (process.env.NODE_ENV === "development") {
      try {
        const response = await fetch(`${API_BASE_URL}/books/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // Add timeout to prevent long wait when server is down
          signal: AbortSignal.timeout(3000),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (fetchError) {
        console.log("Backend connection failed, using fallback book deletion");

        // Mock successful deletion
        return NextResponse.json({ message: "Book deleted successfully" });
      }
    } else {
      // Production code path
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { message: "Server error - please check if backend server is running" },
      { status: 500 }
    );
  }
}
