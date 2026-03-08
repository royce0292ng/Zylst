'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSession } from './auth';
import type { CreateItemInput, UpdateWishlistInput } from '@/types/wishlist';

// Get all wishlists (Owned by user OR user is a collaborator)
export async function getWishlists() {
    const userEmail = await getSession();
    if (!userEmail) return [];

    const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
            wishlists: {
                orderBy: { createdAt: 'desc' },
                include: {
                    items: {
                        include: { claimedBy: { select: { username: true } } }
                    }
                }
            },
            collaborations: {
                include: {
                    wishlist: {
                        include: {
                            items: {
                                include: { claimedBy: { select: { username: true } } }
                            },
                            user: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!user) return [];

    // Map owned wishlists, tagging them as 'owner'
    const ownedWishlists = user.wishlists.map(w => ({ ...w, _role: 'OWNER' }));

    // Map collaborated wishlists, tagging them with their role
    const collaboratedWishlists = user.collaborations.map(c => ({
        ...c.wishlist,
        _role: c.role
    }));

    // Combine and sort by createdAt descending
    const allWishlists = [...ownedWishlists, ...collaboratedWishlists].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    return allWishlists;
}

// Create new wishlist
export async function createWishlist(name: string, eventDate: string) {
    const userEmail = await getSession();
    if (!userEmail) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) throw new Error("User not found");

    const wishlist = await prisma.wishlist.create({
        data: {
            name,
            eventDate: new Date(eventDate),
            userId: user.id
        },
    });

    revalidatePath('/wishlists');
    return wishlist;
}

// Helper to verify write access (Owner or Co-host)
async function verifyWriteAccess(wishlistId: string, requireOwner: boolean = false) {
    const userEmail = await getSession();
    if (!userEmail) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) throw new Error("User not found");

    const wishlist = await prisma.wishlist.findUnique({
        where: { id: wishlistId },
        include: {
            user: true,
            collaborators: {
                where: { userId: user.id }
            }
        }
    });

    if (!wishlist) throw new Error("Wishlist not found");

    const isOwner = !wishlist.userId || wishlist.user?.email === userEmail; // Unclaimed lists are editable
    const isCoHost = wishlist.collaborators.length > 0 && wishlist.collaborators[0].role === 'COHOST';

    if (requireOwner && !isOwner) {
        throw new Error("Unauthorized: Only the wishlist owner can perform this action");
    }

    if (!isOwner && !isCoHost) {
        throw new Error("Unauthorized: You do not have write access to this wishlist");
    }

    return wishlist;
}

// Join a wishlist
export async function joinWishlist(wishlistId: string) {
    const userEmail = await getSession();
    if (!userEmail) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) throw new Error("User not found");

    const wishlist = await prisma.wishlist.findUnique({ where: { id: wishlistId } });
    if (!wishlist) throw new Error("Wishlist not found");

    // Don't join if they are the owner
    if (wishlist.userId === user.id) return { success: true, message: "You are the owner" };

    try {
        await prisma.collaborator.create({
            data: {
                userId: user.id,
                wishlistId: wishlistId,
                role: 'VIEWER'
            }
        });
        revalidatePath(`/wishlists/${wishlistId}`);
        revalidatePath(`/wishlists`);
        return { success: true };
    } catch (e: any) {
        // Ignore unique constraint error if they already joined
        if (e.code === 'P2002') return { success: true, message: "Already joined" };
        throw e;
    }
}

// Update a collaborator's role
export async function updateCollaboratorRole(wishlistId: string, targetUserId: string, role: 'VIEWER' | 'COHOST') {
    await verifyWriteAccess(wishlistId, false); // Owner or Co-Host can do this

    await prisma.collaborator.update({
        where: {
            wishlistId_userId: {
                wishlistId,
                userId: targetUserId
            }
        },
        data: { role }
    });

    revalidatePath(`/wishlists/${wishlistId}`);
}

// Remove a collaborator
export async function removeCollaborator(wishlistId: string, targetUserId: string) {
    await verifyWriteAccess(wishlistId, false); // Owner or Co-Host can do this

    await prisma.collaborator.delete({
        where: {
            wishlistId_userId: {
                wishlistId,
                userId: targetUserId
            }
        }
    });

    revalidatePath(`/wishlists/${wishlistId}`);
}

// Get wishlist by ID
export async function getWishlist(id: string, userEmail?: string | null) {
    const wishlist = await prisma.wishlist.findUnique({
        where: { id },
        include: {
            items: {
                orderBy: { position: 'asc' },
                include: { claimedBy: { select: { username: true } } }
            },
            user: {
                select: { email: true, username: true }
            },
            collaborators: {
                include: {
                    user: {
                        select: { id: true, email: true, username: true }
                    }
                }
            }
        },
    });

    if (!wishlist) return null;

    let userRole: "OWNER" | "COHOST" | "VIEWER" | null = null;
    if (userEmail) {
        if (wishlist.user?.email === userEmail) {
            userRole = 'OWNER';
        } else {
            const collab = wishlist.collaborators.find(c => c.user.email === userEmail);
            if (collab) userRole = collab.role;
        }
    }

    return { ...wishlist, _userRole: userRole };
}

// Update wishlist details
export async function updateWishlist(id: string, data: UpdateWishlistInput) {
    await verifyWriteAccess(id);
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
    await verifyWriteAccess(wishlistId);
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
    const userEmail = await getSession();
    if (!userEmail) throw new Error("Unauthorized to claim items. Please log in.");

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) throw new Error("User not found");

    const wishlist = await verifyWriteAccess(wishlistId, false).catch(() => null);
    // If verifyWriteAccess fails, it means they are just a viewer or logged in user.
    // That's fine for claiming, but we need to know if they are the owner for force-unclaim.
    const actualWishlist = await prisma.wishlist.findUnique({
        where: { id: wishlistId },
        include: { user: true }
    });
    const isOwner = actualWishlist?.userId === user.id;

    const item = await prisma.item.findUnique({
        where: { id: itemId },
        include: { claimedBy: true }
    });

    if (!item) {
        throw new Error('Item not found');
    }

    if (item.completed) {
        // Unclaiming
        if (item.claimedById !== user.id && !isOwner) {
            throw new Error("Only the person who claimed this item (or the wishlist owner) can unclaim it.");
        }
    }

    const updated = await prisma.item.update({
        where: { id: itemId },
        data: {
            completed: !item.completed,
            claimedById: !item.completed ? user.id : null
        },
        include: { claimedBy: { select: { username: true } } }
    });

    revalidatePath(`/wishlists/${wishlistId}`);
    return updated;
}

// Delete item
export async function deleteItem(wishlistId: string, itemId: string) {
    await verifyWriteAccess(wishlistId);
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
    await verifyWriteAccess(wishlistId);
    const updated = await prisma.item.update({
        where: { id: itemId },
        data,
    });

    revalidatePath(`/wishlists/${wishlistId}`);
    return updated;
}

// Delete Wishlist
export async function deleteWishlist(id: string) {
    await verifyWriteAccess(id, true); // Only owner can delete
    await prisma.wishlist.delete({ where: { id } });
    revalidatePath('/wishlists');
    redirect('/wishlists');
}