import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
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
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      subscriptionPlan,
      referralCode,
    } = body;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate activation token
    const activationToken = uuidv4();

    // Create user in Supabase
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert([
        {
          name: `${firstName} ${lastName}`,
          email,
          password: hashedPassword,
          phone,
          subscription_plan: subscriptionPlan,
          referral_code: referralCode,
          activation_token: activationToken,
          is_active: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (userError) {
      console.error("Error creating user:", userError);
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Send activation email
    const activationLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/activate?token=${activationToken}`;
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: "Activate your account",
      html: `
        <h1>Welcome to our platform!</h1>
        <p>Thank you for registering. Please click the link below to activate your account:</p>
        <a href="${activationLink}">${activationLink}</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (emailError) {
      console.error("Error sending activation email:", emailError);
      // Don't fail the registration if email fails
    }

    return NextResponse.json(
      { message: "Registration successful. Please check your email to activate your account." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
} 