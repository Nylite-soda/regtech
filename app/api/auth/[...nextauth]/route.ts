import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import sgMail from "@sendgrid/mail";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        // Check if user exists in Supabase
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (error || !user) {
          throw new Error("No user found with this email");
        }

        // Verify password using bcrypt
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Check if user exists
        const { data: existingUser, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email)
          .single();

        if (userError) {
          // User doesn't exist, create new user with OAuth token
          const oauthToken = uuidv4();
          const { error: createError } = await supabase
            .from("users")
            .insert([
              {
                email: user.email,
                name: user.name,
                oauth_token: oauthToken,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ]);

          if (createError) {
            console.error("Error creating user:", createError);
            return false;
          }

          // Redirect to complete registration
          return `/auth/complete-registration?token=${oauthToken}`;
        }

        // User exists, proceed with sign in
        return true;
      }
      return true;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST }; 