"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategorySummary,
} from "@/types";
import { Decimal } from "@prisma/client/runtime/library";

function decimalToNumber(value: Decimal | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return Number(value);
}

export async function getCategoriesByPlanId(
  planId: string
): Promise<CategorySummary[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify plan ownership
  const plan = await prisma.plan.findFirst({
    where: { id: planId, userId: session.user.id },
  });

  if (!plan) {
    throw new Error("Plan not found");
  }

  const categories = await prisma.category.findMany({
    where: { planId },
    include: {
      items: true,
    },
    orderBy: { sortOrder: "asc" },
  });

  return categories.map((category) => ({
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
  }));
}

export async function createCategory(
  input: CreateCategoryInput
): Promise<{ id: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify plan ownership
  const plan = await prisma.plan.findFirst({
    where: { id: input.planId, userId: session.user.id },
  });

  if (!plan) {
    throw new Error("Plan not found");
  }

  // Get max sort order
  const maxSortOrder = await prisma.category.aggregate({
    where: { planId: input.planId },
    _max: { sortOrder: true },
  });

  const category = await prisma.category.create({
    data: {
      planId: input.planId,
      name: input.name,
      description: input.description,
      color: input.color ?? "#6366f1",
      icon: input.icon,
      allocatedBudget: input.allocatedBudget ?? 0,
      sortOrder: (maxSortOrder._max.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath(`/dashboard/plans/${input.planId}`);

  return { id: category.id };
}

export async function updateCategory(
  categoryId: string,
  input: UpdateCategoryInput
): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify ownership through plan
  const category = await prisma.category.findFirst({
    where: { id: categoryId },
    include: { plan: true },
  });

  if (!category || category.plan.userId !== session.user.id) {
    throw new Error("Category not found");
  }

  await prisma.category.update({
    where: { id: categoryId },
    data: {
      name: input.name,
      description: input.description,
      color: input.color,
      icon: input.icon,
      allocatedBudget: input.allocatedBudget,
      sortOrder: input.sortOrder,
    },
  });

  revalidatePath(`/dashboard/plans/${category.planId}`);
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify ownership through plan
  const category = await prisma.category.findFirst({
    where: { id: categoryId },
    include: { plan: true },
  });

  if (!category || category.plan.userId !== session.user.id) {
    throw new Error("Category not found");
  }

  await prisma.category.delete({
    where: { id: categoryId },
  });

  revalidatePath(`/dashboard/plans/${category.planId}`);
}

export async function reorderCategories(
  planId: string,
  categoryIds: string[]
): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify plan ownership
  const plan = await prisma.plan.findFirst({
    where: { id: planId, userId: session.user.id },
  });

  if (!plan) {
    throw new Error("Plan not found");
  }

  // Update sort order for each category
  await Promise.all(
    categoryIds.map((id, index) =>
      prisma.category.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  );

  revalidatePath(`/dashboard/plans/${planId}`);
}
