import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import type { Provider } from "next-auth/providers";

// Custom auth errors
class AuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "AuthError";
  }
}

// Build providers array dynamically
const providers: Provider[] = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      // Validate input
      if (!credentials?.email) {
        throw new AuthError("Email is required", "missing_email");
      }
      
      if (!credentials?.password) {
        throw new AuthError("Password is required", "missing_password");
      }

      const email = (credentials.email as string).toLowerCase().trim();
      const password = credentials.password as string;

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new AuthError("Please enter a valid email address", "invalid_email");
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // User not found
      if (!user) {
        throw new AuthError(
          "No account found with this email. Please sign up first.",
          "user_not_found"
        );
      }

      // Guest user trying to login with password
      if (user.isGuest) {
        throw new AuthError(
          "This is a guest account. Please upgrade your account to sign in with a password.",
          "guest_account"
        );
      }

      // User has no password (OAuth only account)
      if (!user.password) {
        throw new AuthError(
          "This account uses social login. Please sign in with Google or another provider.",
          "no_password"
        );
      }

      // Verify password
      const isPasswordValid = await compare(password, user.password);

      if (!isPasswordValid) {
        throw new AuthError(
          "Incorrect password. Please try again.",
          "invalid_password"
        );
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  }),
];

// Only add Google provider if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: "jwt", // Use JWT for credentials provider compatibility
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  trustHost: true,
});
