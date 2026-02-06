// Base translation type - used to ensure all locale files have the same structure
export type TranslationSchema = {
  common: {
    appName: string;
    tagline: string;
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    search: string;
    back: string;
    next: string;
    or: string;
    and: string;
    yes: string;
    no: string;
  };
  auth: {
    signIn: string;
    signUp: string;
    signOut: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    namePlaceholder: string;
    welcomeBack: string;
    signInDescription: string;
    createAccount: string;
    signUpDescription: string;
    orContinueWith: string;
    continueWithGoogle: string;
    signUpWithGoogle: string;
    continueAsGuest: string;
    noAccount: string;
    hasAccount: string;
    signUpHere: string;
    signUpLink: string;
    signInLink: string;
    passwordMinLength: string;
    termsAgreement: string;
    termsOfService: string;
    privacyPolicy: string;
    errorServer: string;
    errorCredentials: string;
    errorPasswordMismatch: string;
    errorEmailExists: string;
    errorAuthTitle: string;
    errorAuthDescription: string;
    tryAgain: string;
    goHome: string;
  };
  home: {
    heroTag: string;
    heroTitle: string;
    heroDescription: string;
    startPlanning: string;
    learnMore: string;
    featuresTitle: string;
    featuresDescription: string;
    ctaTitle: string;
    ctaDescription: string;
    getStarted: string;
    footer: {
      rights: string;
      privacy: string;
      terms: string;
      contact: string;
    };
    features: {
      budget: {
        title: string;
        description: string;
      };
      tasks: {
        title: string;
        description: string;
      };
      vendors: {
        title: string;
        description: string;
      };
      timeline: {
        title: string;
        description: string;
      };
    };
  };
  dashboard: {
    welcomeBack: string;
    overview: string;
    newPlan: string;
    totalBudget: string;
    spent: string;
    completed: string;
    tasksCompleted: string;
    pending: string;
    tasksRemaining: string;
    countdown: string;
    daysUntil: string;
    recentActivity: string;
    recentActivityDescription: string;
    noActivity: string;
    quickActions: string;
    quickActionsDescription: string;
    createNewPlan: string;
    browseVendors: string;
    manageBudget: string;
  };
  sidebar: {
    dashboard: string;
    myPlans: string;
    budget: string;
    timeline: string;
    vendors: string;
    settings: string;
    helpTitle: string;
    helpDescription: string;
    generateAI: string;
  };
  header: {
    searchPlaceholder: string;
    profileSettings: string;
    myPlans: string;
  };
  currency: {
    code: string;
    name: string;
  };
  footerTagline: string;
};
