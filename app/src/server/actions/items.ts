"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type {
  CreateItemInput,
  UpdateItemInput,
  ItemSummary,
  ItemDetail,
} from "@/types";
import { Decimal } from "@prisma/client/runtime/library";

function decimalToNumber(value: Decimal | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return Number(value);
}

export async function getItemsByCategoryId(
  categoryId: string
): Promise<ItemSummary[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify ownership through category -> plan
  const category = await prisma.category.findFirst({
    where: { id: categoryId },
    include: { plan: true },
  });

  if (!category || category.plan.userId !== session.user.id) {
    throw new Error("Category not found");
  }

  const items = await prisma.item.findMany({
    where: { categoryId },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  return items.map((item) => ({
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
  }));
}

export async function getItemById(itemId: string): Promise<ItemDetail | null> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const item = await prisma.item.findFirst({
    where: { id: itemId },
    include: {
      category: {
        include: { plan: true },
      },
      vendor: true,
    },
  });

  if (!item || item.category.plan.userId !== session.user.id) {
    return null;
  }

  return {
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
    attachments: item.attachments as string[] | undefined,
    vendor: item.vendor
      ? {
          id: item.vendor.id,
          name: item.vendor.name,
          website: item.vendor.website ?? undefined,
          affiliateLink: item.vendor.affiliateLink ?? undefined,
          categoryTags: item.vendor.categoryTags,
          location: item.vendor.location ?? undefined,
          rating: item.vendor.rating ? decimalToNumber(item.vendor.rating) : undefined,
          logoUrl: item.vendor.logoUrl ?? undefined,
          isVerified: item.vendor.isVerified,
        }
      : undefined,
    category: {
      id: item.category.id,
      planId: item.category.planId,
      name: item.category.name,
      description: item.category.description ?? undefined,
      color: item.category.color,
      icon: item.category.icon ?? undefined,
      sortOrder: item.category.sortOrder,
      allocatedBudget: decimalToNumber(item.category.allocatedBudget),
      itemsCount: 0, // Not needed for item detail
      totalEstimated: 0,
      totalActual: 0,
    },
  };
}

export async function createItem(
  input: CreateItemInput
): Promise<{ id: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify ownership through category -> plan
  const category = await prisma.category.findFirst({
    where: { id: input.categoryId },
    include: { plan: true },
  });

  if (!category || category.plan.userId !== session.user.id) {
    throw new Error("Category not found");
  }

  const item = await prisma.item.create({
    data: {
      categoryId: input.categoryId,
      name: input.name,
      description: input.description,
      estimatedCost: input.estimatedCost ?? 0,
      priority: input.priority ?? 0,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      vendorLink: input.vendorLink,
      notes: input.notes,
    },
  });

  revalidatePath(`/dashboard/plans/${category.planId}`);

  return { id: item.id };
}

export async function updateItem(
  itemId: string,
  input: UpdateItemInput
): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify ownership through item -> category -> plan
  const item = await prisma.item.findFirst({
    where: { id: itemId },
    include: {
      category: {
        include: { plan: true },
      },
    },
  });

  if (!item || item.category.plan.userId !== session.user.id) {
    throw new Error("Item not found");
  }

  await prisma.item.update({
    where: { id: itemId },
    data: {
      name: input.name,
      description: input.description,
      status: input.status,
      estimatedCost: input.estimatedCost,
      actualCost: input.actualCost,
      paidAmount: input.paidAmount,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      vendorId: input.vendorId,
      vendorLink: input.vendorLink,
      notes: input.notes,
    },
  });

  revalidatePath(`/dashboard/plans/${item.category.planId}`);
}

export async function deleteItem(itemId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify ownership through item -> category -> plan
  const item = await prisma.item.findFirst({
    where: { id: itemId },
    include: {
      category: {
        include: { plan: true },
      },
    },
  });

  if (!item || item.category.plan.userId !== session.user.id) {
    throw new Error("Item not found");
  }

  await prisma.item.delete({
    where: { id: itemId },
  });

  revalidatePath(`/dashboard/plans/${item.category.planId}`);
}
