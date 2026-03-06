"use client";

import { useEffect, useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    Button,
    Link,
    Divider,
    ScrollShadow,
} from "@heroui/react";
import { Plus, ListIcon, Calendar, Gift } from "lucide-react";
import { getWishlists } from "@/app/actions/wishlist";
import type { Wishlist } from "@/types/wishlist";
import { useParams } from "next/navigation";

interface WishlistSidebarProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function WishlistSidebar({ isOpen, onOpenChange }: WishlistSidebarProps) {
    const params = useParams();
    const currentId = params.id as string;
    const [wishlists, setWishlists] = useState<Wishlist[]>([]);

    useEffect(() => {
        if (isOpen) {
            const fetchWishlists = async () => {
                const data = await getWishlists();
                setWishlists(data as Wishlist[]);
            };
            fetchWishlists();
        }
    }, [isOpen]);

    return (
        <Drawer
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="left"
            backdrop="blur"
            classNames={{
                base: "bg-zinc-950/90 border-r border-white/10 text-white",
                header: "border-b border-white/10",
            }}
        >
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Gift className="w-5 h-5 text-blue-400" />
                                <span className="text-xl font-bold tracking-tight">Your Wishlists</span>
                            </div>
                            <p className="text-xs text-zinc-500 font-normal">Manage and access your gift lists</p>
                        </DrawerHeader>
                        <DrawerBody className="px-0 py-4">
                            <div className="px-6 mb-4">
                                <Button
                                    className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10"
                                    startContent={<Plus size={18} />}
                                    variant="flat"
                                >
                                    New Wishlist
                                </Button>
                            </div>

                            <Divider className="bg-white/5" />

                            <ScrollShadow className="h-[calc(100vh-180px)] px-4 py-4">
                                <div className="space-y-1">
                                    {wishlists.map((wishlist) => (
                                        <Link
                                            key={wishlist.id}
                                            href={`/wishlists/${wishlist.id}`}
                                            onPress={onClose}
                                            className={`
                                                flex flex-col items-start gap-1 p-3 rounded-xl transition-all duration-200
                                                ${currentId === wishlist.id
                                                    ? "bg-blue-600/20 border border-blue-500/30 text-white"
                                                    : "hover:bg-white/5 text-zinc-400 hover:text-white border border-transparent"
                                                }
                                            `}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span className="font-medium truncate">{wishlist.name}</span>
                                                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">
                                                    {wishlist.items.length} items
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                                                <Calendar size={10} />
                                                <span>{new Date(wishlist.eventDate).toLocaleDateString()}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </ScrollShadow>
                        </DrawerBody>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
