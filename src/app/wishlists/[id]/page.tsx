// src/app/wishlists/[id]/page.tsx
import { getWishlist } from '../../actions/wishlist';
import { WishlistClient } from './WishlistClient';
import { notFound, redirect } from 'next/navigation';
import { cookies } from "next/headers";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function WishlistPage({ params }: PageProps) {
    const session = (await cookies()).get("session");
    if (!session) {
        redirect("/?auth=login");
    }
    // Await the params Promise
    const resolvedParams = await params;
    const { id } = resolvedParams;

    console.log('Wishlist ID:', id); // Debug log

    if (!id) {
        console.error('No ID provided');
        notFound();
    }

    const wishlist = await getWishlist(id);

    if (!wishlist) {
        console.error('Wishlist not found:', id);
        notFound();
    }

    return <WishlistClient wishlist={wishlist} />;
}