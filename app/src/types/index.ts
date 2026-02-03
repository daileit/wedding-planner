import { DefaultSession } from "next-auth";

// Extend the default session type to include user ID
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

// ==========================================
// Enum Types (Mirror Prisma Enums)
// ==========================================

export type PlanType =
  | "WEDDING"
  | "PARTY"
  | "CORPORATE_EVENT"
  | "HOUSE_RENOVATION"
  | "TRAVEL"
  | "OTHER";

export type PlanStatus = "DRAFT" | "ACTIVE" | "COMPLETED" | "ARCHIVED";

export type ItemStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "BOOKED"
  | "PAID"
  | "COMPLETED"
  | "CANCELLED";

export type Currency =
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "AUD"
  | "CAD"
  | "CHF"
  | "CNY"
  | "INR"
  | "VND";

// ==========================================
// Wedding-Specific Metadata Types
// ==========================================

export interface WeddingMetadata {
  eventDate?: string;
  venue?: string;
  guestCount?: number;
  theme?: string;
  primaryColor?: string;
  secondaryColor?: string;
  partnerName1?: string;
  partnerName2?: string;
  ceremonyTime?: string;
  receptionTime?: string;
  dressCode?: string;
}

// ==========================================
// API Response Types
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==========================================
// Plan Types for Frontend
// ==========================================

export interface PlanSummary {
  id: string;
  title: string;
  type: PlanType;
  status: PlanStatus;
  totalBudget: number;
  currency: Currency;
  totalEstimated: number;
  totalActual: number;
  categoriesCount: number;
  itemsCount: number;
  eventDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanDetail extends PlanSummary {
  description?: string;
  metadata?: WeddingMetadata;
  categories: CategoryWithItems[];
}

export interface CategorySummary {
  id: string;
  planId: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  sortOrder: number;
  allocatedBudget: number;
  itemsCount: number;
  totalEstimated: number;
  totalActual: number;
}

export interface CategoryWithItems extends CategorySummary {
  items: ItemSummary[];
}

export interface ItemSummary {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  status: ItemStatus;
  estimatedCost: number;
  actualCost?: number;
  paidAmount: number;
  priority: number;
  dueDate?: string;
  vendorId?: string;
  vendorLink?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemDetail extends ItemSummary {
  vendor?: VendorSummary;
  attachments?: string[];
  category?: CategorySummary;
}

export interface VendorSummary {
  id: string;
  name: string;
  website?: string;
  affiliateLink?: string;
  categoryTags: string[];
  location?: string;
  rating?: number;
  logoUrl?: string;
  isVerified: boolean;
}

// ==========================================
// Form Input Types (for Server Actions)
// ==========================================

export interface CreatePlanInput {
  title: string;
  description?: string;
  type?: PlanType;
  totalBudget: number;
  currency?: Currency;
  eventDate?: string;
  metadata?: WeddingMetadata;
}

export interface UpdatePlanInput {
  title?: string;
  description?: string;
  status?: PlanStatus;
  totalBudget?: number;
  currency?: Currency;
  eventDate?: string;
  metadata?: WeddingMetadata;
}

export interface CreateCategoryInput {
  planId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  allocatedBudget?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  allocatedBudget?: number;
  sortOrder?: number;
}

export interface CreateItemInput {
  categoryId: string;
  name: string;
  description?: string;
  estimatedCost?: number;
  priority?: number;
  dueDate?: string;
  vendorLink?: string;
  notes?: string;
}

export interface UpdateItemInput {
  name?: string;
  description?: string;
  status?: ItemStatus;
  estimatedCost?: number;
  actualCost?: number;
  paidAmount?: number;
  priority?: number;
  dueDate?: string;
  vendorId?: string;
  vendorLink?: string;
  notes?: string;
}

// ==========================================
// UI State Types
// ==========================================

export interface BudgetOverview {
  totalBudget: number;
  totalEstimated: number;
  totalActual: number;
  totalPaid: number;
  remaining: number;
  percentageUsed: number;
  percentagePaid: number;
  currency: Currency;
}

export interface CategoryBudgetStatus {
  categoryId: string;
  categoryName: string;
  color: string;
  allocated: number;
  estimated: number;
  actual: number;
  percentageOfTotal: number;
}

export interface DashboardStats {
  totalPlans: number;
  activePlans: number;
  completedItems: number;
  pendingItems: number;
  upcomingDeadlines: number;
}
