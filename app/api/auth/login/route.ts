import { API_BASE_URL } from "@/app/config/api";
import { type NextRequest, NextResponse } from "next/server";

// Try both localhost and 127.0.0.1 for direct IP address connection
// Sometimes IPv6 (::1) can cause issues on Windows
const BACKEND_URL = process.env.BACKEND_URL || "YOUR_DEPLOYED_BACKEND_URL";

export async function POST(request: NextRequest) {
  try {
    const credentials = await request.json();

    // For development testing only - fallback auth when backend is down
    if (process.env.NODE_ENV === "development") {
      const { email, password } = credentials;

      const mockUsers = [
        {
          id: "1",
          email: "admin@test.com",
          password: "admin123",
          role: "admin",
        },
        { id: "2", email: "user@test.com", password: "user123", role: "user" },
      ];

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          // Add timeout to prevent long wait when server is down
          signal: AbortSignal.timeout(3000),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      } catch (fetchError) {
        console.log("Backend connection failed, using fallback authentication");

        // If backend is unreachable, use mock users
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        );
        if (!user) {
          return NextResponse.json(
            { message: "Invalid credentials" },
            { status: 401 }
          );
        }

        const token = "mock-jwt-token-" + user.id;
        return NextResponse.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        });
      }
    } else {
      // Production code path - only try the backend
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        message: "Server error - please check if backend server is running",
      },
      { status: 500 }
    );
  }
}
