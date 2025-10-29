import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // In NextAuth, the refresh token is stored in the JWT token
  // We need to access it from the session
  return NextResponse.json({ 
    refreshToken: (session as any).refreshToken || "Token not found - check auth.ts callbacks"
  });
}

