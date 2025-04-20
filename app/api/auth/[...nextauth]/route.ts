// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { v4 as uuidv4 } from "uuid";

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
    
//   ],
//   pages: {
//     signIn: "/auth/signin",
//   },
//   callbacks: {
//     async signIn({ user, account }) {
//       if (account?.provider === "google") {
//         // Check if user exists
//         const { data: existingUser, error: userError } = await supabase
//           .from("users")
//           .select("*")
//           .eq("email", user.email)
//           .single();

//         if (userError) {
//           // User doesn't exist, create new user with OAuth token
//           const oauthToken = uuidv4();
//           const { error: createError } = await supabase
//             .from("users")
//             .insert([
//               {
//                 email: user.email,
//                 name: user.name,
//                 oauth_token: oauthToken,
//                 created_at: new Date().toISOString(),
//                 updated_at: new Date().toISOString(),
//               },
//             ]);

//           if (createError) {
//             console.error("Error creating user:", createError);
//             return false;
//           }

//           // Redirect to complete registration
//           return `/auth/complete-registration?token=${oauthToken}`;
//         }

//         // User exists, proceed with sign in
//         return true;
//       }
//       return true;
//     },
//     async session({ session, token }) {
//       if (session?.user) {
//         session.user.id = token.sub as string;
//       }
//       return session;
//     },
//   },
// });

// export { handler as GET, handler as POST }; 