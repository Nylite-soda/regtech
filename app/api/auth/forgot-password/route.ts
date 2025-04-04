import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import sgMail from "@sendgrid/mail";
import { v4 as uuidv4 } from "uuid";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (userError) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: "If an account exists with this email, you will receive password reset instructions." },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Update user with reset token
    const { error: updateError } = await supabase
      .from("users")
      .update({
        reset_token: resetToken,
        reset_token_expires: resetTokenExpiry.toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating user with reset token:", updateError);
      return NextResponse.json(
        { error: "Failed to process reset request" },
        { status: 500 }
      );
    }

    // Send reset email
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: "Reset Your Password",
      html: `
        <h2>Reset Your Password</h2>
        <p>You have requested to reset your password. Click the link below to set a new password:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    await sgMail.send(msg);

    return NextResponse.json(
      { message: "If an account exists with this email, you will receive password reset instructions." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to process reset request" },
      { status: 500 }
    );
  }
} 