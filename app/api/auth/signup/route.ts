import { type NextRequest, NextResponse } from "next/server";

// Use 127.0.0.1 instead of localhost to avoid IPv6 issues
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    const { email } = userData;

    // For development testing only - fallback when backend is down
    if (process.env.NODE_ENV === "development") {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
          // Add timeout to prevent long wait when server is down
          signal: AbortSignal.timeout(3000),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (fetchError) {
        console.log("Backend connection failed, using fallback signup");

        // Mock validation
        const mockUsers = [
          { email: "admin@test.com" },
          { email: "user@test.com" },
        ];

        const existingUser = mockUsers.find((u) => u.email === email);
        if (existingUser) {
          return NextResponse.json(
            { message: "User already exists" },
            { status: 400 }
          );
        }

        return NextResponse.json(
          { message: "User created successfully" },
          { status: 201 }
        );
      }
    } else {
      // Production code path - only try the backend
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        message: "Server error - please check if backend server is running",
      },
      { status: 500 }
    );
  }
}
