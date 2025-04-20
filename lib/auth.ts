import { storeRedirectUrl } from './utils';
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export function redirectToLogin() {
  storeRedirectUrl();
  window.location.href = '/auth/signin';
}

export function redirectToCompanyLogin() {
  storeRedirectUrl();
  window.location.href = '/auth/company-login';
}

export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('access_token');
}

export function isCompanyAuthenticated() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('company');
}

export const authOptions: NextAuthOptions = {
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

        // Here you would typically check against your database
        // For now, we'll use a simple example
        const user = {
          id: "1",
          email: credentials.email,
          name: "Test User",
          role: "user",
        };

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Here you would typically check if the user exists in your database
        // For now, we'll always return true
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
    async redirect({ url, baseUrl }) {
      // Handle dynamic redirects from sessionStorage
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // If it's a relative URL, make it absolute
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // Default to the base URL
      return baseUrl;
    },
  },
}; 