import { useEffect, useState } from "react";
import {
    Button,
    Link,
    Navbar as HerouiNavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    useDisclosure,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@heroui/react";
import LoginDrawer from "@/components/ui/LoginDrawer";
import { getSession, logout } from "@/app/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Settings, LogOut, Gift } from "lucide-react";

export default function Navbar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    const menuItems = ["How it Works", "Features", "Secret Santa", "Pricing"];

    useEffect(() => {
        const checkSession = async () => {
            const session = await getSession();
            setUserEmail(session);
        };
        checkSession();
    }, [isOpen]);

    useEffect(() => {
        if (searchParams.get("auth") === "login") {
            onOpen();
        }
    }, [searchParams, onOpen]);

    const handleLogout = async () => {
        await logout();
        setUserEmail(null);
        router.push("/");
    };

    return (
        <HerouiNavbar
            onMenuOpenChange={setIsMenuOpen}
            isBordered
            className="bg-black/40 backdrop-blur-md border-white/10 fixed top-0"
            maxWidth="xl"
        >
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden text-white"
                />
                <NavbarBrand>
                    <Link href="/" className="font-bold text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400">
                        ZYLST
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            {/* Desktop Links */}
            <NavbarContent className="hidden sm:flex gap-8" justify="center">
                {menuItems.map((item, index) => (
                    <NavbarItem key={index}>
                        <Link className="text-slate-400 hover:text-white text-sm transition-colors" href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}>
                            {item}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>

            <NavbarContent justify="end">
                {userEmail ? (
                    <>
                        <NavbarItem>
                            <Dropdown placement="bottom-end" classNames={{
                                base: "bg-zinc-950 border border-white/10 text-white",
                                content: "bg-zinc-950 text-white"
                            }}>
                                <DropdownTrigger>
                                    <Button
                                        variant="flat"
                                        size="sm"
                                        className="text-white bg-white/10 hover:bg-white/20 px-4 font-medium"
                                        startContent={<User size={16} className="text-blue-400" />}
                                    >
                                        Account
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Account management">
                                    <DropdownItem
                                        key="wishlists"
                                        startContent={<Gift size={14} className="text-blue-400" />}
                                        onPress={() => router.push("/wishlists")}
                                    >
                                        My Wishlists
                                    </DropdownItem>
                                    <DropdownItem key="profile" startContent={<User size={14} />}>
                                        My Profile
                                    </DropdownItem>
                                    <DropdownItem key="settings" startContent={<Settings size={14} />}>
                                        Account Settings
                                    </DropdownItem>
                                    <DropdownItem
                                        key="logout"
                                        color="danger"
                                        className="text-danger"
                                        startContent={<LogOut size={14} />}
                                        onPress={handleLogout}
                                    >
                                        Logout
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </NavbarItem>
                    </>
                ) : (
                    <NavbarItem>
                        <Button
                            variant="flat"
                            size="sm"
                            className="text-white bg-white/10 hover:bg-white/20"
                            onPress={onOpen}
                        >
                            Login
                        </Button>
                    </NavbarItem>
                )}
            </NavbarContent>

            {/* Mobile Menu Drawer */}
            <NavbarMenu className="bg-black/90 backdrop-blur-xl pt-6 border-t border-white/10">
                {userEmail && (
                    <NavbarMenuItem>
                        <Link className="w-full text-white text-xl py-2" href="/wishlists" size="lg">
                            My Wishlist
                        </Link>
                    </NavbarMenuItem>
                )}
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link className="w-full text-white text-xl py-2" href="#" size="lg">
                            {item}
                        </Link>
                    </NavbarMenuItem>
                ))}
                {!userEmail && (
                    <Button color="primary" className="mt-4 font-bold" onPress={onOpen}>Login</Button>
                )}
            </NavbarMenu>
            <LoginDrawer isOpen={isOpen} onOpenChange={onOpenChange} />
        </HerouiNavbar>
    );
}