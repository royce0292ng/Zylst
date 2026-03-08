import type { Wishlist as PrismaWishlist, Item as PrismaItem } from '@prisma/client';

export type Item = PrismaItem & {
    claimedBy?: { username: string } | null;
    claimedById?: string | null;
};

export type Wishlist = PrismaWishlist & {
    items: Item[];
    user?: { email: string; username: string } | null;
    collaborators?: {
        id: string;
        wishlistId: string;
        userId: string;
        role: "VIEWER" | "COHOST";
        user: { id: string; email: string; username: string };
    }[];
    _userRole?: "OWNER" | "COHOST" | "VIEWER" | null;
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