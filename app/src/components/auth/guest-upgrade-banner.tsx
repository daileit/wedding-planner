"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { upgradeGuestAccount } from "@/server/actions/auth";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

interface GuestUpgradeBannerProps {
  isGuest: boolean;
}

export function GuestUpgradeBanner({ isGuest }: GuestUpgradeBannerProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isGuest) return null;

  async function handleUpgrade(formData: FormData) {
    setLoading(true);
    setError(null);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const result = await upgradeGuestAccount({ name, email, password });

    if (!result.success) {
      setError(result.error || "Failed to upgrade account");
      setLoading(false);
      return;
    }

    setOpen(false);
    router.refresh();
  }

  return (
    <div className="mb-4 flex items-center justify-between rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-4 py-3">
      <div className="flex items-center gap-3">
        <UserPlus className="h-5 w-5 text-yellow-600" />
        <div>
          <p className="text-sm font-medium">You&apos;re using a guest account</p>
          <p className="text-xs text-muted-foreground">
            Create an account to save your progress permanently
          </p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Create Account
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to Full Account</DialogTitle>
            <DialogDescription>
              Create an account to save your wedding plans permanently and access
              them from any device.
            </DialogDescription>
          </DialogHeader>

          <form action={handleUpgrade} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="upgrade-name">Full Name</Label>
              <Input
                id="upgrade-name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                minLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="upgrade-email">Email</Label>
              <Input
                id="upgrade-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="upgrade-password">Password</Label>
              <Input
                id="upgrade-password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="upgrade-confirmPassword">Confirm Password</Label>
              <Input
                id="upgrade-confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
