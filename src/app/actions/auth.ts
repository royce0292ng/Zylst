"use server"

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { cookies } from "next/headers";

const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    username: z.string().min(3),
    interests: z.array(z.string()).optional(),
    source: z.string().optional(),
});

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export type AuthResponse =
    | { success: true; message?: string }
    | { success: false; error: string };

export async function signup(data: any): Promise<AuthResponse> {
    try {
        const validated = SignupSchema.parse(data);

        // Check if user already exists
        const existingEmail = await prisma.user.findUnique({
            where: { email: validated.email },
        });
        if (existingEmail) return { success: false, error: "Email already in use." };

        const existingUsername = await prisma.user.findUnique({
            where: { username: validated.username },
        });
        if (existingUsername) return { success: false, error: "Username already taken." };

        // Hash password
        const hashedPassword = await bcrypt.hash(validated.password, 10);

        // Create user
        await prisma.user.create({
            data: {
                email: validated.email,
                password: hashedPassword,
                username: validated.username,
                interests: validated.interests || [],
                source: validated.source || null,
            },
        });

        // Set session cookie
        (await cookies()).set("session", validated.email, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        return { success: true, message: "Ascension complete!" };
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        console.error("Signup error:", error);
        return { success: false, error: "The stars have misaligned. Please try again." };
    }
}

export async function login(data: any): Promise<AuthResponse> {
    try {
        const validated = LoginSchema.parse(data);

        const user = await prisma.user.findUnique({
            where: { email: validated.email },
        });

        if (!user) return { success: false, error: "Invalid email or password." };

        const passwordMatch = await bcrypt.compare(validated.password, user.password);
        if (!passwordMatch) return { success: false, error: "Invalid email or password." };

        // Set session cookie
        (await cookies()).set("session", user.email, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        return { success: true, message: "Welcome back to the Zenith." };
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        console.error("Login error:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}
export async function logout() {
    (await cookies()).delete("session");
}

export async function getSession(): Promise<string | null> {
    const sessionCookie = (await cookies()).get("session");
    return sessionCookie?.value || null;
}
