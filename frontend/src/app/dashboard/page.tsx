import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {session.user.name?.split(" ")[0]}! 💍
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your wedding planning progress.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/plans/new">
            <Plus className="mr-2 h-4 w-4" />
            New Plan
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Budget Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalBudget.toLocaleString()}
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Spent: ${stats.spent.toLocaleString()}</span>
                <span>{percentageSpent}%</span>
              </div>
              <Progress value={percentageSpent} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              tasks completed so far
            </p>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              tasks remaining
            </p>
          </CardContent>
        </Card>

        {/* Countdown */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countdown</CardTitle>
            <CalendarDays className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.daysUntilWedding}</div>
            <p className="text-xs text-muted-foreground">
              days until your wedding
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest planning updates and changes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">
                No recent activity. Start by creating a new plan!
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to help you plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/plans/new">
                <Plus className="mr-2 h-4 w-4" />
                Create New Plan
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/vendors">
                <Plus className="mr-2 h-4 w-4" />
                Browse Vendors
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/budget">
                <DollarSign className="mr-2 h-4 w-4" />
                Manage Budget
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
