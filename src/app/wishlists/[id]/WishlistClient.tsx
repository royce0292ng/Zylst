'use client';

import { useState, useTransition } from 'react';
import type { Wishlist } from '@/types/wishlist';
import { updateWishlist, addItem, toggleItem, deleteItem } from '@/app/actions/wishlist';
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
} from 'lucide-react';
import { Card, CardBody, DatePicker, CalendarDate, Button, Input, Progress, Chip } from "@heroui/react";
import { parseAbsoluteToLocal, toCalendarDate } from "@internationalized/date";
import { motion, AnimatePresence } from "framer-motion";

export function WishlistClient({ wishlist: initialWishlist }: { wishlist: Wishlist }) {
    const [wishlist, setWishlist] = useState(initialWishlist);
    const [isPending, startTransition] = useTransition();
    const [newItem, setNewItem] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState('');
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [tempDate, setTempDate] = useState<CalendarDate | null>(null);

    const handleNameChange = async (name: string) => {
        startTransition(async () => {
            const updated = await updateWishlist(wishlist.id, { name });
            setWishlist(updated);
        });
    };

    const handleDateChange = async (eventDate: string) => {
        startTransition(async () => {
            const updated = await updateWishlist(wishlist.id, { eventDate });
            setWishlist(updated);
        });
    };

    const handleAddItem = () => {
        if (newItem.trim() === '') return;

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
        setWishlist((prev) => ({
            ...prev,
            items: prev.items.filter((item) => item.id !== itemId),
        }));

        startTransition(async () => {
            await deleteItem(wishlist.id, itemId);
        });
    };

    const startEditingName = () => {
        setTempName(wishlist.name);
        setIsEditingName(true);
    };

    const saveName = async () => {
        if (tempName.trim() !== '') {
            await handleNameChange(tempName);
        }
        setIsEditingName(false);
    };

    const startEditingDate = () => {
        setTempDate(toCalendarDate(parseAbsoluteToLocal(wishlist.eventDate.toISOString())));
        setIsEditingDate(true);
    };

    const saveDate = async () => {
        if (tempDate) {
            await handleDateChange(tempDate.toString());
        }
        setIsEditingDate(false);
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

    return (
        <div className="flex min-h-[calc(100vh-64px)] justify-center bg-zinc-950 font-sans p-4 md:p-8">
            <div className="w-full max-w-4xl space-y-8">
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
                            {daysUntil >= 0 && (
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
                            {isEditingName ? (
                                <Input
                                    variant="underlined"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && saveName()}
                                    onBlur={saveName}
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
                                    <Button
                                        isIconOnly
                                        variant="light"
                                        size="sm"
                                        onPress={startEditingName}
                                        className="text-zinc-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Pencil className="w-5 h-5" />
                                    </Button>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-zinc-400 group h-8">
                            {isEditingDate ? (
                                <DatePicker
                                    size="sm"
                                    variant="underlined"
                                    onBlur={saveDate}
                                    onChange={(e) => setTempDate(e)}
                                    onKeyDown={(e) => e.key === 'Enter' && saveDate()}
                                    value={tempDate}
                                    className="max-w-[200px]"
                                />
                            ) : (
                                <>
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm font-medium">{formatDate(wishlist.eventDate)}</span>
                                    <Button
                                        isIconOnly
                                        variant="light"
                                        size="sm"
                                        onPress={startEditingDate}
                                        className="text-zinc-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Pencil className="w-3 h-3" />
                                    </Button>
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
                                        <Card className={`bg-zinc-900/40 border-white/5 hover:border-white/10 transition-all duration-300 ${item.completed ? "opacity-60" : ""}`}>
                                            <CardBody className="p-4 flex flex-row items-center gap-4">
                                                <Button
                                                    isIconOnly
                                                    variant="light"
                                                    onPress={() => handleToggleItem(item.id)}
                                                    className={`shrink-0 ${item.completed ? "text-green-400" : "text-zinc-600 hover:text-white"}`}
                                                >
                                                    {item.completed ? (
                                                        <CheckCircle2 className="w-6 h-6" />
                                                    ) : (
                                                        <Circle className="w-6 h-6" />
                                                    )}
                                                </Button>

                                                <div className="flex-1 min-w-0">
                                                    <span className={`text-base font-medium transition-all duration-300 block truncate ${item.completed ? "line-through text-zinc-500" : "text-white"}`}>
                                                        {item.text}
                                                    </span>
                                                    {item.priority && (
                                                        <div className="flex gap-2 mt-1">
                                                            <Chip size="sm" variant="dot" color={item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'warning' : 'success'} className="border-none p-0 text-[10px]">
                                                                {item.priority}
                                                            </Chip>
                                                        </div>
                                                    )}
                                                </div>

                                                <Button
                                                    isIconOnly
                                                    variant="light"
                                                    size="sm"
                                                    onPress={() => handleDeleteItem(item.id)}
                                                    className="opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-zinc-600 hover:text-red-400 hover:bg-red-400/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>

                                                <ChevronRight className="w-4 h-4 text-zinc-700 shrink-0" />
                                            </CardBody>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Add Item Bar */}
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
                                {wishlist.items.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="flex gap-3 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                        <p className="text-zinc-400 leading-relaxed">
                                            <span className="text-zinc-200 font-medium">New item </span>
                                            "{item.text}" was added to the list.
                                        </p>
                                    </div>
                                ))}
                                {wishlist.items.length === 0 && (
                                    <p className="text-xs text-zinc-600 italic">No activity yet. Start adding items!</p>
                                )}
                            </div>
                        </section>

                        <section className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6 border-dashed">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                                <Tag size={16} className="text-zinc-500" />
                                Share & Invite
                            </h3>
                            <p className="text-xs text-zinc-500 mb-4 line-clamp-2">
                                Share this wishlist with friends and family so they know exactly what you want!
                            </p>
                            <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10" variant="flat">
                                Copy List Link
                            </Button>
                        </section>
                    </div>
                </div>
            </div>

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