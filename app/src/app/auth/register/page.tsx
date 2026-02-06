import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";
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
import { Heart } from "lucide-react";
import Link from "next/link";
import { registerUser } from "@/server/actions/auth";
import { getTranslations } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { LanguageSwitcher } from "@/components/language-switcher";

export default async function RegisterPage({
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
  const locale = await getLocale();
  const t = getTranslations(locale);

  async function handleRegister(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      redirect("/auth/register?error=PasswordMismatch");
    }

    const result = await registerUser({ name, email, password });

    if (!result.success) {
      redirect(`/auth/register?error=${encodeURIComponent(result.error || "Unknown")}`);
    }

    // Auto sign in after registration
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher currentLocale={locale} />
      </div>

      <div className="mb-8 flex flex-col items-center">
        <Heart className="h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold">{t.common.appName}</h1>
        <p className="mt-2 text-muted-foreground">
          {t.common.tagline}
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{t.auth.createAccount}</CardTitle>
          <CardDescription>
            {t.auth.signUpDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {params.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {params.error === "PasswordMismatch"
                ? t.auth.errorPasswordMismatch
                : params.error === "An account with this email already exists"
                  ? t.auth.errorEmailExists
                  : params.error}
            </div>
          )}

          {/* Registration Form */}
          <form action={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t.auth.fullName}</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder={t.auth.namePlaceholder}
                required
                minLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.email}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t.auth.emailPlaceholder}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.auth.password}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={t.auth.passwordPlaceholder}
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">
                {t.auth.passwordMinLength}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.auth.confirmPassword}</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder={t.auth.passwordPlaceholder}
                required
                minLength={8}
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              {t.auth.createAccount}
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
                    {t.auth.orContinueWith}
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
                  {t.auth.signUpWithGoogle}
                </Button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-muted-foreground">
            {t.auth.hasAccount}{" "}
            <Link href="/auth/signin" className="font-medium text-primary hover:underline">
              {t.auth.signInLink}
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground">
            {t.auth.termsAgreement}{" "}
            <a href="/terms" className="underline hover:text-primary">
              {t.auth.termsOfService}
            </a>{" "}
            {t.common.and}{" "}
            <a href="/privacy" className="underline hover:text-primary">
              {t.auth.privacyPolicy}
            </a>
          </p>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t.footerTagline}
      </p>
    </div>
  );
}
