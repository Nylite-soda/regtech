import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extend the session object with custom fields
   */
  interface Session {
    user: {
      /** FastAPI user ID */
      apiUserId: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Extend the JWT object with custom fields
   */
  interface JWT {
    /** FastAPI access token */
    accessToken?: string;
    /** FastAPI user ID */
    apiUserId?: string;
  }
}