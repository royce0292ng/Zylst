// src/app/wishlists/[id]/page.tsx
import { getWishlist } from '../../actions/wishlist';
import { WishlistClient } from './WishlistClient';
import { notFound } from 'next/navigation';
import { cookies } from "next/headers";
import prisma from '@/lib/prisma';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function WishlistPage({ params }: PageProps) {
    const session = (await cookies()).get("session");
    const userEmail = session?.value || null;
    // Await the params Promise
    const resolvedParams = await params;
    const { id } = resolvedParams;

    console.log('Wishlist ID:', id); // Debug log

    if (!id) {
        console.error('No ID provided');
        notFound();
    }

    const wishlist = await getWishlist(id, userEmail);

    if (!wishlist) {
        console.error('Wishlist not found:', id);
        notFound();
    }

    // Fetch the current user's username so the client can compare with claimedBy.username
    let currentUsername: string | null = null;
    if (userEmail) {
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            select: { username: true }
        });
        currentUsername = user?.username || null;
    }

    return <WishlistClient wishlist={wishlist} userEmail={userEmail} currentUsername={currentUsername} />;
}