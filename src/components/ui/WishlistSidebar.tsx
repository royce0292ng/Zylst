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
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Input,
    DatePicker,
} from "@heroui/react";
import { Plus, Gift, Calendar } from "lucide-react";
import { getWishlists, createWishlist } from "@/app/actions/wishlist";
import type { Wishlist } from "@/types/wishlist";
import { useParams, useRouter } from "next/navigation";
import { today, getLocalTimeZone } from "@internationalized/date";

interface WishlistSidebarProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function WishlistSidebar({ isOpen, onOpenChange }: WishlistSidebarProps) {
    const params = useParams();
    const router = useRouter();
    const currentId = params.id as string;
    const [wishlists, setWishlists] = useState<Wishlist[]>([]);
    const { isOpen: isModalOpen, onOpen: onModalOpen, onOpenChange: onModalOpenChange } = useDisclosure();

    const [newName, setNewName] = useState("");
    const [newDate, setNewDate] = useState(today(getLocalTimeZone()));
    const [isCreating, setIsCreating] = useState(false);

    const fetchWishlists = async () => {
        const data = await getWishlists();
        // data contains objects with _role property ('OWNER', 'VIEWER', 'COHOST')
        setWishlists(data as any[]);
    };

    useEffect(() => {
        if (isOpen) {
            fetchWishlists();
        }
    }, [isOpen]);

    const handleCreateWishlist = async (onClose: () => void) => {
        if (!newName.trim()) return;

        setIsCreating(true);
        try {
            const wishlist = await createWishlist(newName, newDate.toString());
            await fetchWishlists();
            router.push(`/wishlists/${wishlist.id}`);
            onClose();
            setNewName("");
            setNewDate(today(getLocalTimeZone()));
        } catch (error) {
            console.error("Failed to create wishlist:", error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <>
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
                                        onPress={onModalOpen}
                                    >
                                        New Wishlist
                                    </Button>
                                </div>

                                <Divider className="bg-white/5" />

                                <ScrollShadow className="h-[calc(100vh-180px)] px-4 py-4">
                                    <div className="space-y-6">
                                        {/* My Wishlists Section */}
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-2">My Wishlists</h3>
                                            <div className="space-y-1">
                                                {wishlists.filter((w: any) => w._role === 'OWNER').length === 0 ? (
                                                    <p className="text-xs text-zinc-600 px-2 italic">No wishlists created yet.</p>
                                                ) : (
                                                    wishlists.filter((w: any) => w._role === 'OWNER').map((wishlist) => (
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
                                                                    {wishlist.items?.length || 0} items
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                                                                <Calendar size={10} />
                                                                <span>{new Date(wishlist.eventDate).toLocaleDateString()}</span>
                                                            </div>
                                                        </Link>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                        {/* Joined Wishlists Section */}
                                        <div className="space-y-2">
                                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-2">Joined Wishlists</h3>
                                            <div className="space-y-1">
                                                {wishlists.filter((w: any) => w._role !== 'OWNER').length === 0 ? (
                                                    <p className="text-xs text-zinc-600 px-2 italic">You haven't joined any wishlists.</p>
                                                ) : (
                                                    wishlists.filter((w: any) => w._role !== 'OWNER').map((wishlist: any) => (
                                                        <Link
                                                            key={wishlist.id}
                                                            href={`/wishlists/${wishlist.id}`}
                                                            onPress={onClose}
                                                            className={`
                                                                flex flex-col items-start gap-1 p-3 rounded-xl transition-all duration-200
                                                                ${currentId === wishlist.id
                                                                    ? "bg-purple-600/20 border border-purple-500/30 text-white"
                                                                    : "hover:bg-white/5 text-zinc-400 hover:text-white border border-transparent"
                                                                }
                                                            `}
                                                        >
                                                            <div className="flex items-center justify-between w-full">
                                                                <span className="font-medium truncate">{wishlist.name}</span>
                                                                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full">
                                                                    {wishlist._role === 'COHOST' ? 'Co-host' : 'Viewer'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                                                                <Calendar size={10} />
                                                                <span>{new Date(wishlist.eventDate).toLocaleDateString()}</span>
                                                            </div>
                                                        </Link>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </ScrollShadow>
                            </DrawerBody>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            <Modal
                isOpen={isModalOpen}
                onOpenChange={onModalOpenChange}
                backdrop="blur"
                classNames={{
                    base: "bg-zinc-950 border border-white/10 text-white",
                    header: "border-b border-white/10",
                    footer: "border-t border-white/10",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Create New Wishlist</ModalHeader>
                            <ModalBody className="py-6">
                                <div className="space-y-4">
                                    <Input
                                        label="Wishlist Name"
                                        placeholder="e.g. My Birthday 2026"
                                        variant="bordered"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        classNames={{
                                            label: "text-zinc-400",
                                            inputWrapper: "border-white/10 hover:border-blue-500/50",
                                        }}
                                    />
                                    <DatePicker
                                        label="Event Date"
                                        variant="bordered"
                                        value={newDate}
                                        onChange={(date) => date && setNewDate(date)}
                                        classNames={{
                                            label: "text-zinc-400",
                                            inputWrapper: "border-white/10 hover:border-blue-500/50",
                                        }}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose} className="text-zinc-400">
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={() => handleCreateWishlist(onClose)}
                                    isLoading={isCreating}
                                    className="bg-blue-600 hover:bg-blue-500 font-bold"
                                >
                                    Create Wishlist
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
