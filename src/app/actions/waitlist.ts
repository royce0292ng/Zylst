"use server"

import prisma  from "@/lib/prisma";
import {revalidatePath, unstable_cache} from "next/cache";
import { z } from "zod";

export type WaitlistResponse =
    | { success: true; message?: string }
    | { success: false; error: string };

const WaitlistSchema = z.object({
    email: z.string().email(),
});

export async function joinWaitlist(email: string) : Promise<WaitlistResponse> {
    try {
        // Example error handling
        // return { success: false, error: "Nova Explosion" };
        // 1. Validate on the server
        const validated = WaitlistSchema.parse({ email });

        // 2. Check for existing
        const existing = await prisma.waitlist.findUnique({
            where: { email: validated.email },
        });

        if (existing) return { success: true, message: "Already synced!" };

        // 3. Create record
        await prisma.waitlist.create({
            data: { email: validated.email },
        });

        // Optional: if you have a page listing waitlist counts
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Database error:", error);
        return { success: false, error: "The stars aren't aligning. Please try again." };
    }
}

// Cache the count for 1 minute to stay performant
export const getWaitlistCount = unstable_cache(
    async () => {
        return prisma.waitlist.count();
    },
    ["waitlist-count"],
    { revalidate: 60*15 }
);