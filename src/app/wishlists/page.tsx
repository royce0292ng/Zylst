import {redirect} from "next/navigation";
import prisma from "@/lib/prisma";
import {Prisma} from "@prisma/client";

export default async function WishlistsPage(){
    let wishlist = null;
    let errorMsg = "";

    // Try to Get the first wishlist
    try {
        wishlist = await prisma.wishlist.findFirst({
            orderBy: { createdAt: 'desc' },
        });
    } catch (e) {
        // Log the full error to your terminal for debugging
        console.error("Database connection failed:", e);

        // Check if it's a known Prisma error (like connection issues)
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            errorMsg = "The database is currently unreachable. Please try again later.";
        } else {
            errorMsg = "An unexpected error occurred.";
        }
    }

    if (!wishlist || errorMsg) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">No wishlists found</h1>
                    <p className="text-zinc-600">{errorMsg}</p>
                </div>
            </div>
        );
    }

    redirect(`/wishlists/${wishlist.id}`)
}