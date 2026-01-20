import type { Wishlist as PrismaWishlist, Item as PrismaItem } from '@prisma/client';

export type Item = PrismaItem;

export type Wishlist = PrismaWishlist & {
    items: Item[];
};

export type CreateItemInput = {
    text: string;
    completed?: boolean;
    link?: string;
    description?: string;
    price?: number;
    currency?: string;
    imageUrl?: string;
    category?: string;
    priority?: 'low' | 'medium' | 'high';
    tags?: string[];
};

export type UpdateWishlistInput = {
    name?: string;
    eventDate?: Date | string;
};