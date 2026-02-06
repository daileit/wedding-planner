import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { getTranslations } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { LanguageSwitcher } from "@/components/language-switcher";

export default async function AuthErrorPage() {
  const locale = await getLocale();
  const t = getTranslations(locale);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher currentLocale={locale} />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>{t.auth.errorAuthTitle}</CardTitle>
          <CardDescription>
            {t.auth.errorAuthDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/auth/signin">{t.auth.tryAgain}</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">{t.auth.goHome}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
