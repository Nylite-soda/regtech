import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { token, phone, password, subscriptionPlan, referralCode } = await request.json();

    if (!token || !phone || !password || !subscriptionPlan) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find user with matching token
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("oauth_token", token)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user with additional information
    const { error: updateError } = await supabase
      .from("users")
      .update({
        phone,
        password: hashedPassword,
        subscription_plan: subscriptionPlan,
        referral_code: referralCode || null,
        oauth_token: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating user:", updateError);
      return NextResponse.json(
        { error: "Failed to complete registration" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Registration completed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration completion error:", error);
    return NextResponse.json(
      { error: "Failed to complete registration" },
      { status: 500 }
    );
  }
} 