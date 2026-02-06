import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, AlertCircle, Info } from "lucide-react";
import Link from "next/link";
import { createGuestUser } from "@/server/actions/auth";
import { cookies } from "next/headers";

// Check if error is a server error vs user error
function isServerError(error: string): boolean {
  return error.includes("unavailable") || error.includes("server") || error === "Default";
}

// Get notification type and message
function getNotification(error: string): { type: "info" | "error"; message: string; showSignUp: boolean } {
  // Server errors - show as actual errors
  if (isServerError(error)) {
    return {
      type: "error",
      message: "Something went wrong. Please try again later.",
      showSignUp: false,
    };
  }
  
  // User-related issues - show as helpful info
  return {
    type: "info",
    message: "Invalid email or password. Please check your credentials and try again.",
    showSignUp: true,
  };
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (session?.user) {
    redirect("/dashboard");
  }

  const callbackUrl = params.callbackUrl || "/dashboard";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="mb-8 flex flex-col items-center">
        <Heart className="h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold">WedBeLoving</h1>
        <p className="mt-2 text-muted-foreground">
          Your perfect wedding planning companion
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Sign in to continue planning your perfect wedding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {params.error && (() => {
            const notification = getNotification(params.error);
            return (
              <div className={`rounded-md p-3 text-sm flex items-start gap-2 ${
                notification.type === "error" 
                  ? "bg-destructive/10 text-destructive" 
                  : "bg-muted text-muted-foreground"
              }`}>
                {notification.type === "error" ? (
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                ) : (
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <span>{notification.message}</span>
                  {notification.showSignUp && (
                    <span className="block mt-1">
                      Don&apos;t have an account?{" "}
                      <Link href="/auth/register" className="font-medium text-primary hover:underline">
                        Sign up here
                      </Link>
                    </span>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Email/Password Form */}
          <form
            action={async (formData: FormData) => {
              "use server";
              try {
                await signIn("credentials", {
                  email: formData.get("email"),
                  password: formData.get("password"),
                  redirectTo: callbackUrl,
                });
              } catch (error) {
                // Re-throw redirect errors (Next.js uses these internally)
                if (error && typeof error === "object" && "digest" in error) {
                  throw error;
                }
                // Handle NextAuth errors gracefully
                if (error instanceof AuthError) {
                  redirect(`/auth/signin?error=${error.type}&callbackUrl=${encodeURIComponent(callbackUrl)}`);
                }
                // For any other errors, show generic error
                redirect(`/auth/signin?error=Default&callbackUrl=${encodeURIComponent(callbackUrl)}`);
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          {process.env.GOOGLE_CLIENT_ID && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google OAuth */}
              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo: callbackUrl });
                }}
              >
                <Button type="submit" variant="outline" className="w-full" size="lg">
                  <svg
                    className="mr-2 h-5 w-5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </form>
            </>
          )}

          {/* Guest Access */}
          <form
            action={async () => {
              "use server";
              const result = await createGuestUser();
              if (result.success && result.userId) {
                // Store guest ID in cookie for session creation
                const cookieStore = await cookies();
                cookieStore.set("guest_user_id", result.userId, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "lax",
                  maxAge: 60 * 60 * 24 * 7, // 7 days
                });
                redirect("/dashboard?guest=true");
              }
            }}
          >
            <Button type="submit" variant="ghost" className="w-full" size="lg">
              Continue as Guest
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </a>
          </p>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Plan your dream wedding with ease ✨
      </p>
    </div>
  );
}
