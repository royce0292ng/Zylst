"use client";

import { HeroUIProvider, useDisclosure } from "@heroui/react";
import WishlistNavbar from "@/components/ui/WishlistNavbar";
import WishlistSidebar from "@/components/ui/WishlistSidebar";
import { useEffect, useState } from "react";
import { getSession } from "@/app/actions/auth";

export default function WishlistLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSession();
            setUserEmail(session);
        };
        fetchSession();

        window.addEventListener('auth-change', fetchSession);
        return () => window.removeEventListener('auth-change', fetchSession);
    }, []);

    return (
        <HeroUIProvider>
            <div className="dark text-foreground bg-background min-h-screen">
                <WishlistNavbar userEmail={userEmail} onSidebarToggle={onOpen} />
                {userEmail && <WishlistSidebar isOpen={isOpen} onOpenChange={onOpenChange} />}
                <div className="pt-16">
                    {children}
                </div>
            </div>
        </HeroUIProvider>
    );
}
