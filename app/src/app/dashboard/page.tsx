import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getLocale } from "@/lib/i18n/server";
import { getTranslations, interpolate } from "@/lib/i18n";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Plus,
  DollarSign,
  CheckCircle2,
  Clock,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Placeholder stats - will be replaced with real data from Server Actions
  const stats = {
    totalBudget: 25000,
    spent: 8500,
    completedTasks: 12,
    pendingTasks: 28,
    daysUntilWedding: 180,
  };

  const percentageSpent = Math.round((stats.spent / stats.totalBudget) * 100);
  const locale = await getLocale();
  const t = getTranslations(locale);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {interpolate(t.dashboard.welcomeBack, {
              name: session.user.name?.split(" ")[0] ?? "",
            })}
          </h1>
          <p className="text-muted-foreground">
            {t.dashboard.overview}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/plans/new">
            <Plus className="mr-2 h-4 w-4" />
            {t.dashboard.newPlan}
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Budget Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.totalBudget}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <DollarSign className="h-5 w-5 mr-1" />
              {stats.totalBudget.toLocaleString()} {t.currency.display}
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>
                  Spent: <DollarSign className="h-4 w-4 inline-block" />
                  {stats.spent.toLocaleString()} {t.currency.code}
                </span>
                <span>{percentageSpent}%</span>
              </div>
              <Progress value={percentageSpent} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.completed}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {t.dashboard.tasksCompleted}
            </p>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.pending}</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              {t.dashboard.tasksRemaining}
            </p>
          </CardContent>
        </Card>

        {/* Countdown */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.countdown}</CardTitle>
            <CalendarDays className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.daysUntilWedding}</div>
            <p className="text-xs text-muted-foreground">
              {t.dashboard.daysUntil}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle>{t.dashboard.recentActivity}</CardTitle>
            <CardDescription>
              {t.dashboard.recentActivityDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">
                {t.dashboard.noActivity}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.quickActions}</CardTitle>
            <CardDescription>
              {t.dashboard.quickActionsDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/plans/new">
                <Plus className="mr-2 h-4 w-4" />
                {t.dashboard.createNewPlan}
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/vendors">
                <Plus className="mr-2 h-4 w-4" />
                {t.dashboard.browseVendors}
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/budget">
                <DollarSign className="mr-2 h-4 w-4" />
                {t.dashboard.manageBudget}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
