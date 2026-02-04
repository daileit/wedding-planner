"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";
import { signIn, auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export type AuthResult = {
  success: boolean;
  error?: string;
  userId?: string;
};

/**
 * Register a new user with email and password
 */
export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  try {
    const validated = registerSchema.parse(input);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      // If it's a guest user, upgrade them
      if (existingUser.isGuest) {
        const hashedPassword = await hash(validated.password, 12);
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: validated.name,
            password: hashedPassword,
            isGuest: false,
          },
        });
        return { success: true, userId: existingUser.id };
      }
      return { success: false, error: "An account with this email already exists" };
    }

    // Hash password
    const hashedPassword = await hash(validated.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        isGuest: false,
      },
    });

    return { success: true, userId: user.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message ?? "Validation failed" };
    }
    console.error("Registration error:", error);
    return { success: false, error: "Failed to create account" };
  }
}

/**
 * Sign in with email and password
 */
export async function loginWithCredentials(input: LoginInput): Promise<AuthResult> {
  try {
    const validated = loginSchema.parse(input);

    const result = await signIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: "Invalid email or password" };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message ?? "Validation failed" };
    }
    // NextAuth throws an error on failed login
    return { success: false, error: "Invalid email or password" };
  }
}

/**
 * Create a guest user session
 */
export async function createGuestUser(): Promise<AuthResult> {
  try {
    // Generate a unique guest email
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const guestEmail = `${guestId}@guest.wedbeloving.local`;

    // Create guest user
    const user = await prisma.user.create({
      data: {
        name: "Guest User",
        email: guestEmail,
        isGuest: true,
      },
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Guest creation error:", error);
    return { success: false, error: "Failed to create guest session" };
  }
}

/**
 * Upgrade a guest user to a full account
 */
export async function upgradeGuestAccount(input: RegisterInput): Promise<AuthResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No active session" };
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser?.isGuest) {
      return { success: false, error: "Account is not a guest account" };
    }

    const validated = registerSchema.parse(input);

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser && existingUser.id !== currentUser.id) {
      return { success: false, error: "An account with this email already exists" };
    }

    // Hash password and upgrade account
    const hashedPassword = await hash(validated.password, 12);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        isGuest: false,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, userId: currentUser.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message ?? "Validation failed" };
    }
    console.error("Upgrade error:", error);
    return { success: false, error: "Failed to upgrade account" };
  }
}

/**
 * Check if current user is a guest
 */
export async function isGuestUser(): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isGuest: true },
  });

  return user?.isGuest ?? false;
}
