"use client";

import {
    Navbar as HerouiNavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Button,
    Link,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Avatar,
} from "@heroui/react";
import { Menu, Settings, LogOut, User, Gift } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

interface WishlistNavbarProps {
    userEmail: string | null;
    onSidebarToggle: () => void;
}

export default function WishlistNavbar({ userEmail, onSidebarToggle }: WishlistNavbarProps) {
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    return (
        <HerouiNavbar
            isBordered
            className="bg-black/40 backdrop-blur-md border-white/10 fixed top-0 h-16"
            maxWidth="full"
        >
            <NavbarContent justify="start">
                <Button
                    isIconOnly
                    variant="light"
                    onPress={onSidebarToggle}
                    className="text-white"
                >
                    <Menu className="w-6 h-6" />
                </Button>
                <NavbarBrand className="ml-2">
                    <Link href="/" className="font-bold text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400">
                        ZYLST
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent justify="end">
                <Dropdown placement="bottom-end" classNames={{
                    base: "bg-zinc-950 border border-white/10 text-white",
                    content: "bg-zinc-950 text-white"
                }}>
                    <DropdownTrigger>
                        <Button
                            variant="flat"
                            className="bg-white/10 hover:bg-white/20 text-white px-4 font-medium"
                            startContent={<User size={18} className="text-blue-400" />}
                        >
                            Account
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Account management">
                        <DropdownItem
                            key="wishlists"
                            startContent={<Gift size={16} className="text-blue-400" />}
                            onPress={() => router.push("/wishlists")}
                        >
                            My Wishlists
                        </DropdownItem>
                        <DropdownItem key="profile" startContent={<User size={16} />}>
                            My Profile
                        </DropdownItem>
                        <DropdownItem key="settings" startContent={<Settings size={16} />}>
                            Account Settings
                        </DropdownItem>
                        <DropdownItem
                            key="logout"
                            color="danger"
                            className="text-danger"
                            startContent={<LogOut size={16} />}
                            onPress={handleLogout}
                        >
                            Logout
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </HerouiNavbar>
    );
}
