"use client"



import {useState} from "react";
import {
    Button,
    Link,
    Navbar as HerouiNavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle
} from "@heroui/react";

export default function Navbar() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuItems = ["How it Works", "Features", "Secret Santa", "Pricing"];

    return(
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
                <NavbarItem>
                    <Button variant="flat" size="sm" className="text-white bg-white/10 hover:bg-white/20">Login</Button>
                </NavbarItem>
            </NavbarContent>

            {/* Mobile Menu Drawer */}
            <NavbarMenu className="bg-black/90 backdrop-blur-xl pt-6 border-t border-white/10">
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link className="w-full text-white text-xl py-2" href="#" size="lg">
                            {item}
                        </Link>
                    </NavbarMenuItem>
                ))}
                <Button color="primary" className="mt-4 font-bold">Try Zylst Now</Button>
            </NavbarMenu>
        </HerouiNavbar>
    );
}