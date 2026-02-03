import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, CheckCircle, DollarSign, Calendar, Users } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  // If user is already logged in, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  const features = [
    {
      icon: DollarSign,
      title: "Budget Tracking",
      description:
        "Keep track of your wedding expenses with detailed budget management and real-time spending insights.",
    },
    {
      icon: CheckCircle,
      title: "Task Management",
      description:
        "Never miss a deadline with our comprehensive task lists and timeline tracking features.",
    },
    {
      icon: Users,
      title: "Vendor Directory",
      description:
        "Discover and book the best wedding vendors with exclusive deals and reviews.",
    },
    {
      icon: Calendar,
      title: "Timeline Planning",
      description:
        "Plan every detail from engagement to the big day with our intuitive timeline tools.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">WedBeLoving</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signin">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center gap-8 py-24 text-center md:py-32">
        <div className="flex flex-col items-center gap-4">
          <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            ✨ Your Dream Wedding Starts Here
          </span>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Plan Your Perfect Wedding with{" "}
            <span className="text-primary">WedBeLoving</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
            The all-in-one wedding planning platform that helps you manage
            budgets, organize tasks, track vendors, and create your dream
            wedding effortlessly.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/auth/signin">
              Start Planning Free
              <Heart className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to Plan Your Wedding
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features designed to make wedding planning simple and
            stress-free.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/30 py-24">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Start Planning?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of couples who have planned their perfect wedding
            with WedBeLoving.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/auth/signin">
              Get Started Today
              <Heart className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-semibold">WedBeLoving</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} WedBeLoving. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
