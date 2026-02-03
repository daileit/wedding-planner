"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type {
  CreatePlanInput,
  UpdatePlanInput,
  PlanSummary,
  PlanDetail,
} from "@/types";
import { Decimal } from "@prisma/client/runtime/library";

// Helper to convert Decimal to number
function decimalToNumber(value: Decimal | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return Number(value);
}

export async function getPlans(): Promise<PlanSummary[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const plans = await prisma.plan.findMany({
    where: { userId: session.user.id },
    include: {
      categories: {
        include: {
          items: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return plans.map((plan) => {
    const allItems = plan.categories.flatMap((c) => c.items);
    const totalEstimated = allItems.reduce(
      (sum, item) => sum + decimalToNumber(item.estimatedCost),
      0
    );
    const totalActual = allItems.reduce(
      (sum, item) => sum + decimalToNumber(item.actualCost),
      0
    );

    return {
      id: plan.id,
      title: plan.title,
      type: plan.type,
      status: plan.status,
      totalBudget: decimalToNumber(plan.totalBudget),
      currency: plan.currency,
      totalEstimated,
      totalActual,
      categoriesCount: plan.categories.length,
      itemsCount: allItems.length,
      eventDate: plan.eventDate?.toISOString(),
      createdAt: plan.createdAt.toISOString(),
      updatedAt: plan.updatedAt.toISOString(),
    };
  });
}

export async function getPlanById(planId: string): Promise<PlanDetail | null> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const plan = await prisma.plan.findFirst({
    where: {
      id: planId,
      userId: session.user.id,
    },
    include: {
      categories: {
        include: {
          items: {
            orderBy: { priority: "desc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!plan) return null;

  const allItems = plan.categories.flatMap((c) => c.items);
  const totalEstimated = allItems.reduce(
    (sum, item) => sum + decimalToNumber(item.estimatedCost),
    0
  );
  const totalActual = allItems.reduce(
    (sum, item) => sum + decimalToNumber(item.actualCost),
    0
  );

  return {
    id: plan.id,
    title: plan.title,
    description: plan.description ?? undefined,
    type: plan.type,
    status: plan.status,
    totalBudget: decimalToNumber(plan.totalBudget),
    currency: plan.currency,
    totalEstimated,
    totalActual,
    categoriesCount: plan.categories.length,
    itemsCount: allItems.length,
    eventDate: plan.eventDate?.toISOString(),
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
    metadata: plan.metadata as PlanDetail["metadata"],
    categories: plan.categories.map((category) => ({
      id: category.id,
      planId: category.planId,
      name: category.name,
      description: category.description ?? undefined,
      color: category.color,
      icon: category.icon ?? undefined,
      sortOrder: category.sortOrder,
      allocatedBudget: decimalToNumber(category.allocatedBudget),
      itemsCount: category.items.length,
      totalEstimated: category.items.reduce(
        (sum, item) => sum + decimalToNumber(item.estimatedCost),
        0
      ),
      totalActual: category.items.reduce(
        (sum, item) => sum + decimalToNumber(item.actualCost),
        0
      ),
      items: category.items.map((item) => ({
        id: item.id,
        categoryId: item.categoryId,
        name: item.name,
        description: item.description ?? undefined,
        status: item.status,
        estimatedCost: decimalToNumber(item.estimatedCost),
        actualCost: item.actualCost ? decimalToNumber(item.actualCost) : undefined,
        paidAmount: decimalToNumber(item.paidAmount),
        priority: item.priority,
        dueDate: item.dueDate?.toISOString(),
        vendorId: item.vendorId ?? undefined,
        vendorLink: item.vendorLink ?? undefined,
        notes: item.notes ?? undefined,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    })),
  };
}

export async function createPlan(input: CreatePlanInput): Promise<{ id: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const plan = await prisma.plan.create({
    data: {
      userId: session.user.id,
      title: input.title,
      description: input.description,
      type: input.type ?? "WEDDING",
      totalBudget: input.totalBudget,
      currency: input.currency ?? "USD",
      eventDate: input.eventDate ? new Date(input.eventDate) : undefined,
      metadata: input.metadata ?? undefined,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/plans");

  return { id: plan.id };
}

export async function updatePlan(
  planId: string,
  input: UpdatePlanInput
): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const existing = await prisma.plan.findFirst({
    where: { id: planId, userId: session.user.id },
  });

  if (!existing) {
    throw new Error("Plan not found");
  }

  await prisma.plan.update({
    where: { id: planId },
    data: {
      title: input.title,
      description: input.description,
      status: input.status,
      totalBudget: input.totalBudget,
      currency: input.currency,
      eventDate: input.eventDate ? new Date(input.eventDate) : undefined,
      metadata: input.metadata ?? undefined,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/plans/${planId}`);
}

export async function deletePlan(planId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const existing = await prisma.plan.findFirst({
    where: { id: planId, userId: session.user.id },
  });

  if (!existing) {
    throw new Error("Plan not found");
  }

  await prisma.plan.delete({
    where: { id: planId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/plans");
}
