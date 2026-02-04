import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { GuestUpgradeBanner } from "@/components/auth/guest-upgrade-banner";
import { isGuestUser } from "@/server/actions/auth";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const cookieStore = await cookies();
  const guestUserId = cookieStore.get("guest_user_id")?.value;

  // Allow access if authenticated OR has guest cookie
  if (!session?.user && !guestUserId) {
    redirect("/auth/signin");
  }

  const isGuest = session?.user ? await isGuestUser() : !!guestUserId;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={session?.user || { name: "Guest User", email: "" }} />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 lg:p-6">
          <GuestUpgradeBanner isGuest={isGuest} />
          {children}
        </main>
      </div>
    </div>
  );
}
