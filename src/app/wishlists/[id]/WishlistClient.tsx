'use client';

import { useState, useTransition, useMemo, useEffect } from 'react';
import type { Wishlist, Item } from '@/types/wishlist';
import { updateWishlist, addItem, toggleItem, deleteItem, updateItem } from '@/app/actions/wishlist';
import {
    Pencil,
    Trash2,
    Calendar,
    Circle,
    CircleCheckBig,
    Plus,
    Clock,
    CheckCircle2,
    ChevronRight,
    ShoppingBag,
    Tag,
    Gift,
    Share2,
    Link as LinkIcon,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    DollarSign,
    QrCode,
    Check,
} from 'lucide-react';
import {
    Card,
    CardBody,
    DatePicker,
    CalendarDate,
    Button,
    Input,
    Progress,
    Chip,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Textarea,
    Select,
    SelectItem,
} from "@heroui/react";
import { parseAbsoluteToLocal, toCalendarDate } from "@internationalized/date";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";

export function WishlistClient({
    wishlist: initialWishlist,
    userEmail
}: {
    wishlist: Wishlist;
    userEmail: string | null;
}) {
    const [wishlist, setWishlist] = useState(initialWishlist);
    const [isPending, startTransition] = useTransition();
    const [newItem, setNewItem] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState('');
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [tempDate, setTempDate] = useState<CalendarDate | null>(null);
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { isOpen: isShareOpen, onOpen: onShareOpen, onOpenChange: onShareOpenChange } = useDisclosure();

    const isOwner = !!userEmail; // Placeholder: In a real app, check if user.id === wishlist.userId

    const handleUpdateWishlist = async (data: any) => {
        if (!isOwner) return;
        startTransition(async () => {
            const updated = await updateWishlist(wishlist.id, data);
            setWishlist(updated);
        });
    };

    const handleAddItem = () => {
        if (newItem.trim() === '' || !isOwner) return;

        const text = newItem;
        setNewItem('');

        const tempItem = {
            id: `temp-${Date.now()}`,
            text,
            completed: false,
            position: wishlist.items.length,
            link: null,
            description: null,
            price: null,
            currency: 'USD',
            imageUrl: null,
            category: null,
            priority: 'medium' as const,
            tags: [],
            wishlistId: wishlist.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        setWishlist((prev) => ({
            ...prev,
            items: [...prev.items, tempItem],
        }));

        startTransition(async () => {
            const newItemFromDb = await addItem(wishlist.id, { text });
            setWishlist((prev) => ({
                ...prev,
                items: prev.items.map((item) => (item.id === tempItem.id ? newItemFromDb : item)),
            }));
        });
    };

    const handleToggleItem = async (itemId: string) => {
        // Anyone can toggle (claim) items
        setWishlist((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
            ),
        }));

        startTransition(async () => {
            await toggleItem(wishlist.id, itemId);
        });
    };

    const handleDeleteItem = async (itemId: string) => {
        if (!isOwner) return;
        setWishlist((prev) => ({
            ...prev,
            items: prev.items.filter((item) => item.id !== itemId),
        }));

        startTransition(async () => {
            await deleteItem(wishlist.id, itemId);
        });
    };

    const handleUpdateItem = async (itemId: string, data: Partial<Item>) => {
        if (!isOwner) return;

        // Optimistic update
        setWishlist((prev) => ({
            ...prev,
            items: prev.items.map((item) => (item.id === itemId ? { ...item, ...data } : item)),
        }));

        startTransition(async () => {
            await updateItem(wishlist.id, itemId, data as any);
        });
    };

    const formatDate = (dateString: Date | string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getDaysUntil = (dateString: Date | string) => {
        const eventDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        const diffTime = eventDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const daysUntil = getDaysUntil(wishlist.eventDate);
    const completedCount = wishlist.items.filter(i => i.completed).length;
    const totalCount = wishlist.items.length;
    const progressValue = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    const [shareUrl, setShareUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShareUrl(`${window.location.origin}/wishlists/${wishlist.id}`);
        }
    }, [wishlist.id]);
    const handleDownloadQR = () => {
        const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
        if (canvas) {
            const pngUrl = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `wishlist-${wishlist.name.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] justify-center bg-zinc-950 font-sans p-4 md:p-8">
            <div className="w-full max-w-4xl space-y-8">
                {/* Guest Banner */}
                {!isOwner && (
                    <Card className="bg-blue-600/10 border-blue-500/20">
                        <CardBody className="flex flex-row items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <Gift className="text-blue-400" size={20} />
                                <div>
                                    <p className="text-sm font-bold text-white">Viewing as Guest</p>
                                    <p className="text-xs text-zinc-400">Sign up to create your own wishlists!</p>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                color="primary"
                                className="font-bold"
                                onPress={() => window.location.href = '?auth=login'}
                            >
                                Sign Up
                            </Button>
                        </CardBody>
                    </Card>
                )}

                {/* Header Section */}
                <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Chip
                                variant="flat"
                                size="sm"
                                className="bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                startContent={<Gift size={12} />}
                            >
                                Wishlist
                            </Chip>
                            {isMounted && daysUntil >= 0 && (
                                <Chip
                                    variant="flat"
                                    size="sm"
                                    className="bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                >
                                    {daysUntil === 0 ? "Happening Today" : `${daysUntil} days remaining`}
                                </Chip>
                            )}
                        </div>

                        <div className="group flex items-center gap-4">
                            {isEditingName && isOwner ? (
                                <Input
                                    variant="underlined"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (handleUpdateWishlist({ name: tempName }), setIsEditingName(false))}
                                    onBlur={() => (handleUpdateWishlist({ name: tempName }), setIsEditingName(false))}
                                    className="text-4xl md:text-5xl font-bold max-w-lg"
                                    autoFocus
                                    classNames={{
                                        input: "text-4xl md:text-5xl font-bold text-white",
                                    }}
                                />
                            ) : (
                                <>
                                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                        {wishlist.name}
                                    </h1>
                                    {isOwner && (
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            size="sm"
                                            onPress={() => { setTempName(wishlist.name); setIsEditingName(true); }}
                                            className="text-zinc-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-zinc-400 group h-8">
                            {isEditingDate && isOwner ? (
                                <DatePicker
                                    size="sm"
                                    variant="underlined"
                                    onBlur={() => setIsEditingDate(false)}
                                    onChange={(e) => {
                                        if (e) {
                                            handleUpdateWishlist({ eventDate: e.toString() });
                                            setIsEditingDate(false);
                                        }
                                    }}
                                    value={tempDate}
                                    className="max-w-[200px]"
                                />
                            ) : (
                                <>
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        {isMounted ? formatDate(wishlist.eventDate) : '...'}
                                    </span>
                                    {isOwner && (
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            size="sm"
                                            onPress={() => {
                                                setTempDate(toCalendarDate(parseAbsoluteToLocal(wishlist.eventDate.toISOString())));
                                                setIsEditingDate(true);
                                            }}
                                            className="text-zinc-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Pencil className="w-3 h-3" />
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 min-w-[240px]">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Completion</span>
                            <span className="text-sm font-bold text-white">{Math.round(progressValue)}%</span>
                        </div>
                        <Progress
                            value={progressValue}
                            className="h-2"
                            color="primary"
                            classNames={{
                                indicator: "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            }}
                        />
                        <div className="mt-4 flex gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-zinc-500 uppercase font-bold">Claimed</span>
                                <span className="text-xl font-bold text-white">{completedCount}</span>
                            </div>
                            <div className="w-px h-8 bg-white/5" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-zinc-500 uppercase font-bold">Total</span>
                                <span className="text-xl font-bold text-white">{totalCount}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <ShoppingBag size={20} className="text-blue-400" />
                                Gift Items
                            </h3>
                            <span className="text-xs text-zinc-500 font-medium">{totalCount - completedCount} items remaining</span>
                        </div>

                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {wishlist.items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Card className={`group bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-all duration-300 ${item.completed ? "opacity-60" : ""}`}>
                                            <CardBody className="p-0">
                                                <div className="p-4 flex flex-row items-center gap-4">
                                                    <Button
                                                        isIconOnly
                                                        variant="light"
                                                        onPress={isOwner ? () => handleToggleItem(item.id) : undefined}
                                                        className={`shrink-0 ${item.completed ? "text-green-400" : "text-zinc-600 hover:text-white"} ${!isOwner ? 'opacity-70 cursor-default hover:text-zinc-600' : ''}`}
                                                        disableAnimation={!isOwner}
                                                    >
                                                        {item.completed ? (
                                                            <CheckCircle2 className="w-6 h-6" />
                                                        ) : (
                                                            <Circle className="w-6 h-6" />
                                                        )}
                                                    </Button>

                                                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpandedItemId(expandedItemId === item.id ? null : item.id)}>
                                                        <span className={`text-base font-medium transition-all duration-300 block truncate ${item.completed ? "line-through text-zinc-500" : "text-white"}`}>
                                                            {item.text}
                                                        </span>
                                                        <div className="flex gap-2 mt-1">
                                                            {item.priority && (
                                                                <Chip size="sm" variant="dot" color={item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'warning' : 'success'} className="border-none p-0 text-[10px]">
                                                                    {item.priority}
                                                                </Chip>
                                                            )}
                                                            {item.price && (
                                                                <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                                                                    <DollarSign size={10} />
                                                                    {item.price}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        {isOwner && (
                                                            <Button
                                                                isIconOnly
                                                                variant="light"
                                                                size="sm"
                                                                onPress={() => handleDeleteItem(item.id)}
                                                                className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 hover:bg-red-400/10"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            isIconOnly
                                                            variant="light"
                                                            size="sm"
                                                            onPress={() => setExpandedItemId(expandedItemId === item.id ? null : item.id)}
                                                            className="text-zinc-600 hover:text-white"
                                                        >
                                                            {expandedItemId === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Expandable Content */}
                                                <AnimatePresence>
                                                    {expandedItemId === item.id && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="overflow-hidden border-t border-white/5 bg-zinc-900/60"
                                                        >
                                                            <div className="p-6 space-y-6">
                                                                {isOwner ? (
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                        <div className="space-y-4">
                                                                            <Textarea
                                                                                label="Description"
                                                                                placeholder="Add details like size, color, or style preferences..."
                                                                                variant="bordered"
                                                                                value={item.description || ''}
                                                                                onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                                                                                classNames={{ label: "text-zinc-500", inputWrapper: "border-white/10" }}
                                                                            />
                                                                            <Input
                                                                                label="Product Link"
                                                                                placeholder="https://..."
                                                                                variant="bordered"
                                                                                value={item.link || ''}
                                                                                onChange={(e) => handleUpdateItem(item.id, { link: e.target.value })}
                                                                                classNames={{ label: "text-zinc-500", inputWrapper: "border-white/10" }}
                                                                                endContent={item.link && (
                                                                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-400">
                                                                                        <ExternalLink size={14} />
                                                                                    </a>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-4">
                                                                            <div className="flex gap-4">
                                                                                <Input
                                                                                    label="Estimated Price"
                                                                                    placeholder="0.00"
                                                                                    variant="bordered"
                                                                                    value={item.price?.toString() || ''}
                                                                                    onChange={(e) => handleUpdateItem(item.id, { price: parseFloat(e.target.value) || 0 })}
                                                                                    startContent={<DollarSign size={14} className="text-zinc-500" />}
                                                                                    classNames={{ label: "text-zinc-500", inputWrapper: "border-white/10" }}
                                                                                />
                                                                                <Select
                                                                                    label="Priority"
                                                                                    variant="bordered"
                                                                                    selectedKeys={[item.priority || 'medium']}
                                                                                    onSelectionChange={(keys) => handleUpdateItem(item.id, { priority: Array.from(keys)[0] as any })}
                                                                                    classNames={{ label: "text-zinc-500", trigger: "border-white/10" }}
                                                                                >
                                                                                    <SelectItem key="low" textValue="Low">Low</SelectItem>
                                                                                    <SelectItem key="medium" textValue="Medium">Medium</SelectItem>
                                                                                    <SelectItem key="high" textValue="High">High</SelectItem>
                                                                                </Select>
                                                                            </div>
                                                                            <Input
                                                                                label="Category"
                                                                                placeholder="e.g. Electronics, Books"
                                                                                variant="bordered"
                                                                                value={item.category || ''}
                                                                                onChange={(e) => handleUpdateItem(item.id, { category: e.target.value })}
                                                                                classNames={{ label: "text-zinc-500", inputWrapper: "border-white/10" }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="space-y-4">
                                                                        {item.description && (
                                                                            <div>
                                                                                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Description</p>
                                                                                <p className="text-sm text-zinc-300">{item.description}</p>
                                                                            </div>
                                                                        )}
                                                                        <div className="flex flex-wrap gap-6">
                                                                            {item.link && (
                                                                                <div>
                                                                                    <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Link</p>
                                                                                    <a
                                                                                        href={item.link}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="text-sm text-blue-400 flex items-center gap-1 hover:underline"
                                                                                    >
                                                                                        View Product <ExternalLink size={12} />
                                                                                    </a>
                                                                                </div>
                                                                            )}
                                                                            {item.price && (
                                                                                <div>
                                                                                    <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Estimated Price</p>
                                                                                    <p className="text-sm text-white font-medium">${item.price}</p>
                                                                                </div>
                                                                            )}
                                                                            {item.category && (
                                                                                <div>
                                                                                    <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Category</p>
                                                                                    <Chip size="sm" variant="flat" className="bg-white/5 text-zinc-300">{item.category}</Chip>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </CardBody>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Add Item Bar */}
                            {isOwner && (
                                <div className="pt-4">
                                    <div className="relative group">
                                        <Input
                                            placeholder="I'm wishing for..."
                                            value={newItem}
                                            onChange={(e) => setNewItem(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                                            className="w-full"
                                            classNames={{
                                                input: "text-white py-6",
                                                inputWrapper: "bg-zinc-900/60 border-white/10 hover:border-blue-500/50 group-focus-within:border-blue-500 transition-all rounded-2xl h-14"
                                            }}
                                            endContent={
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    onPress={handleAddItem}
                                                    className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                                                >
                                                    <Plus size={18} />
                                                </Button>
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar/Activity/Details Column */}
                    <div className="space-y-6">
                        <section className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 space-y-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                                <Clock size={16} className="text-zinc-500" />
                                Recent Activity
                            </h3>
                            <div className="space-y-4">
                                {wishlist.items.length > 0 ? (
                                    wishlist.items.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="flex gap-3 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                            <p className="text-zinc-400 leading-relaxed">
                                                <span className="text-zinc-200 font-medium">New item </span>
                                                "{item.text}" was added to the list.
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-zinc-600 italic">No activity yet. Start adding items!</p>
                                )}
                            </div>
                        </section>

                        <section className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6 border-dashed">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                                <Share2 size={16} className="text-zinc-500" />
                                Share & Invite
                            </h3>
                            <p className="text-xs text-zinc-500 mb-4">
                                Share this wishlist with friends and family so they know exactly what you want!
                            </p>
                            <Button
                                className="w-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 font-bold"
                                variant="flat"
                                onPress={onShareOpen}
                                startContent={<QrCode size={16} />}
                            >
                                Share List
                            </Button>
                        </section>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            <Modal
                isOpen={isShareOpen}
                onOpenChange={onShareOpenChange}
                backdrop="blur"
                classNames={{
                    base: "bg-zinc-950 border border-white/10 text-white",
                    header: "border-b border-white/10",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <Share2 className="text-blue-400" size={18} />
                                    <span>Share Wishlist</span>
                                </div>
                                <p className="text-xs text-zinc-500 font-normal">Invite others to view and claim items</p>
                            </ModalHeader>
                            <ModalBody className="py-8 flex flex-col items-center gap-8">
                                <div className="p-4 bg-white rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] relative group flex justify-center items-center">
                                    <QRCodeCanvas
                                        id="qr-code-canvas"
                                        value={shareUrl}
                                        size={192}
                                        bgColor={"#ffffff"}
                                        fgColor={"#000000"}
                                        level={"L"}
                                        includeMargin={false}
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-2xl p-4">
                                        <Button size="sm" color="primary" className="font-bold w-full" onPress={handleDownloadQR}>
                                            Download Image
                                        </Button>
                                    </div>
                                </div>

                                <div className="w-full space-y-2">
                                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest text-center">Share Link</p>
                                    <div className="flex gap-2">
                                        <Input
                                            isReadOnly
                                            value={shareUrl}
                                            variant="bordered"
                                            classNames={{
                                                input: "text-zinc-400 text-xs",
                                                inputWrapper: "border-white/10 bg-white/5",
                                            }}
                                        />
                                        <Button
                                            isIconOnly
                                            color={copySuccess ? "success" : "primary"}
                                            onPress={handleCopyLink}
                                            className="shrink-0"
                                        >
                                            {copySuccess ? <Check size={18} /> : <LinkIcon size={18} />}
                                        </Button>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" className="w-full font-bold" onPress={onClose}>
                                    Done
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <style jsx global>{`
                @keyframes drawCheck {
                    from { stroke-dashoffset: 100; }
                    to { stroke-dashoffset: 0; }
                }
                .dark {
                    color-scheme: dark;
                }
            `}</style>
        </div>
    );
}