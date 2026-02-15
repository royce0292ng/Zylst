'use server';

import prisma from '@/lib/prisma';
import {revalidatePath} from 'next/cache';
import type {CreateItemInput, UpdateWishlistInput} from '@/types/wishlist';

// Get wishlist by ID
export async function getWishlist(id: string) {
    return prisma.wishlist.findUnique({
        where: {id},
        include: {
            items: {
                orderBy: {position: 'asc'},
            },
        },
    });
}

// Update wishlist details
export async function updateWishlist(id: string, data: UpdateWishlistInput) {
    const wishlist = await prisma.wishlist.update({
        where: { id },
        data: {
            name: data.name,
            eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
        },
        include: { items: true },
    });

    revalidatePath(`/wishlists/${id}`);
    return wishlist;
}

// Add new item
export async function addItem(wishlistId: string, data: CreateItemInput) {
    const item = await prisma.item.create({
        data: {
            ...data,
            wishlistId,
        },
    });

    revalidatePath(`/wishlists/${wishlistId}`);
    return item;
}

// Toggle item completion
export async function toggleItem(wishlistId: string, itemId: string) {
    const item = await prisma.item.findUnique({
        where: { id: itemId },
    });

    if (!item) {
        throw new Error('Item not found');
    }

    const updated = await prisma.item.update({
        where: { id: itemId },
        data: { completed: !item.completed },
    });

    revalidatePath(`/wishlists/${wishlistId}`);
    return updated;
}

// Delete item
export async function deleteItem(wishlistId: string, itemId: string) {
    await prisma.item.delete({
        where: { id: itemId },
    });

    revalidatePath(`/wishlists/${wishlistId}`);
}

// Update item details
export async function updateItem(
    wishlistId: string,
    itemId: string,
    data: Partial<CreateItemInput>
) {
    const updated = await prisma.item.update({
        where: { id: itemId },
        data,
    });

    revalidatePath(`/wishlists/${wishlistId}`);
    return updated;
}