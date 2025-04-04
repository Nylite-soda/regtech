import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Activation token is required" },
        { status: 400 }
      );
    }

    // Find user with matching activation token
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("activation_token", token)
      .eq("is_active", false)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid or expired activation token" },
        { status: 400 }
      );
    }

    // Check if token is expired (24 hours)
    const tokenCreatedAt = new Date(user.created_at);
    const now = new Date();
    const hoursDiff = (now.getTime() - tokenCreatedAt.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      return NextResponse.json(
        { error: "Activation token has expired" },
        { status: 400 }
      );
    }

    // Activate user
    const { error: updateError } = await supabase
      .from("users")
      .update({
        is_active: true,
        activation_token: null,
        activated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error activating user:", updateError);
      return NextResponse.json(
        { error: "Failed to activate account" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Account activated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Activation error:", error);
    return NextResponse.json(
      { error: "An error occurred during account activation" },
      { status: 500 }
    );
  }
} 