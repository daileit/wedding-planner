import type { TranslationSchema } from "../types";

const en: TranslationSchema = {
  // ==========================================
  // Common
  // ==========================================
  common: {
    appName: "WedBeLoving",
    tagline: "Your perfect wedding planning companion",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    search: "Search",
    back: "Back",
    next: "Next",
    or: "Or",
    and: "and",
    yes: "Yes",
    no: "No",
  },

  // ==========================================
  // Auth
  // ==========================================
  auth: {
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Log out",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "••••••••",
    namePlaceholder: "John Doe",
    welcomeBack: "Welcome Back",
    signInDescription: "Sign in to continue planning your perfect wedding",
    createAccount: "Create Account",
    signUpDescription: "Sign up to start planning your perfect wedding",
    orContinueWith: "Or continue with",
    continueWithGoogle: "Continue with Google",
    signUpWithGoogle: "Sign up with Google",
    continueAsGuest: "Continue as Guest",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    signUpHere: "Sign up here",
    signUpLink: "Sign up",
    signInLink: "Sign in",
    passwordMinLength: "Must be at least 8 characters",
    termsAgreement: "By continuing, you agree to our",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    // Errors
    errorServer: "Something went wrong. Please try again later.",
    errorCredentials: "Invalid email or password. Please check your credentials and try again.",
    errorPasswordMismatch: "Passwords do not match",
    errorEmailExists: "An account with this email already exists",
    errorAuthTitle: "Authentication Error",
    errorAuthDescription: "There was a problem signing you in. Please try again.",
    tryAgain: "Try Again",
    goHome: "Go Home",
  },

  // ==========================================
  // Home / Landing
  // ==========================================
  home: {
    heroTag: "✨ Your Dream Wedding Starts Here",
    heroTitle: "Plan Your Perfect Wedding with",
    heroDescription: "The all-in-one wedding planning platform that helps you manage budgets, organize tasks, track vendors, and create your dream wedding effortlessly.",
    startPlanning: "Start Planning Free",
    learnMore: "Learn More",
    featuresTitle: "Everything You Need to Plan Your Wedding",
    featuresDescription: "Powerful features designed to make wedding planning simple and stress-free.",
    ctaTitle: "Ready to Start Planning?",
    ctaDescription: "Join thousands of couples who have planned their perfect wedding with WedBeLoving.",
    getStarted: "Get Started Today",
    footer: {
      rights: "All rights reserved.",
      privacy: "Privacy",
      terms: "Terms",
      contact: "Contact",
    },
    features: {
      budget: {
        title: "Budget Tracking",
        description: "Keep track of your wedding expenses with detailed budget management and real-time spending insights.",
      },
      tasks: {
        title: "Task Management",
        description: "Never miss a deadline with our comprehensive task lists and timeline tracking features.",
      },
      vendors: {
        title: "Vendor Directory",
        description: "Discover and book the best wedding vendors with exclusive deals and reviews.",
      },
      timeline: {
        title: "Timeline Planning",
        description: "Plan every detail from engagement to the big day with our intuitive timeline tools.",
      },
    },
  },

  // ==========================================
  // Dashboard
  // ==========================================
  dashboard: {
    welcomeBack: "Welcome back, {name}! 💍",
    overview: "Here's an overview of your wedding planning progress.",
    newPlan: "New Plan",
    totalBudget: "Total Budget",
    spent: "Spent",
    completed: "Completed",
    tasksCompleted: "tasks completed so far",
    pending: "Pending",
    tasksRemaining: "tasks remaining",
    countdown: "Countdown",
    daysUntil: "days until your wedding",
    recentActivity: "Recent Activity",
    recentActivityDescription: "Your latest planning updates and changes.",
    noActivity: "No recent activity. Start by creating a new plan!",
    quickActions: "Quick Actions",
    quickActionsDescription: "Common tasks to help you plan.",
    createNewPlan: "Create New Plan",
    browseVendors: "Browse Vendors",
    manageBudget: "Manage Budget",
  },

  // ==========================================
  // Sidebar
  // ==========================================
  sidebar: {
    dashboard: "Dashboard",
    myPlans: "My Plans",
    budget: "Budget",
    timeline: "Timeline",
    vendors: "Vendors",
    settings: "Settings",
    helpTitle: "Need help planning?",
    helpDescription: "Try our AI assistant to generate your wedding plan automatically.",
    generateAI: "Generate with AI",
  },

  // ==========================================
  // Header
  // ==========================================
  header: {
    searchPlaceholder: "Search plans, items, vendors...",
    profileSettings: "Profile Settings",
    myPlans: "My Plans",
  },

  // ==========================================
  // Currency
  // ==========================================
  currency: {
    code: "USD",
    name: "US Dollar",
  },

  // ==========================================
  // Footer tagline
  // ==========================================
  footerTagline: "Plan your dream wedding with ease ✨",
};

export default en;
