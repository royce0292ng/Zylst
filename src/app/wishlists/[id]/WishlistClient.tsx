'use client';

import { useState, useTransition } from 'react';
import type { Wishlist } from '@/types/wishlist';
import { updateWishlist, addItem, toggleItem, deleteItem } from '@/app/actions/whislist';
import {
    Pencil,
    Trash2,
    Calendar,
    Circle,
    CircleCheckBig,
    ExternalLink,
    DollarSign,
    Tag,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { Card, HeroUIProvider, CardBody, DatePicker, CalendarDate, Button, Input } from "@heroui/react";
import { parseAbsoluteToLocal, toCalendarDate } from "@internationalized/date";

export function WishlistClient({ wishlist: initialWishlist }: { wishlist: Wishlist }) {
    const [wishlist, setWishlist] = useState(initialWishlist);
    const [isPending, startTransition] = useTransition();
    const [newItem, setNewItem] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState('');
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [tempDate, setTempDate] = useState<CalendarDate | null>(null);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

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

        // Optimistic update
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
        // Optimistic update
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
        // Optimistic update
        setWishlist((prev) => ({
            ...prev,
            items: prev.items.filter((item) => item.id !== itemId),
        }));

        startTransition(async () => {
            await deleteItem(wishlist.id, itemId);
        });
    };

    const toggleExpand = (id: string) => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
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
            console.log(tempDate);
            await handleDateChange(tempDate.toString());
        }
        setIsEditingDate(false);
    };

    const formatDate = (dateString: Date | string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
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

    const getPriorityColor = (priority?: string | null) => {
        switch (priority) {
            case 'high':
                return 'text-red-600 bg-red-50';
            case 'medium':
                return 'text-amber-600 bg-amber-50';
            case 'low':
                return 'text-green-600 bg-green-50';
            default:
                return 'text-zinc-600 bg-zinc-50';
        }
    };

    const daysUntil = getDaysUntil(wishlist.eventDate);

    return (
        <HeroUIProvider>
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
                <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                    <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                        {/* Header */}
                        <h1 className="text-2xl font-bold text-black"> Zylst </h1>

                        {/* Event Name */}
                        <div className="flex items-center gap-2">
                            {isEditingName ? (
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && saveName()}
                                    onBlur={saveName}
                                    className="px-3 py-1 border border-zinc-300 rounded font-medium text-zinc-950 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    autoFocus
                                />
                            ) : (
                                <>
                                    <h2 className="font-medium text-zinc-950 dark:text-zinc-50">
                                        {wishlist.name}
                                    </h2>
                                    <button
                                        onClick={startEditingName}
                                        className="p-1 hover:bg-zinc-100 rounded transition-colors"
                                        title="Edit event name"
                                    >
                                        <Pencil className="w-4 h-4 text-zinc-600" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Event Date */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {isEditingDate ? (
                                <DatePicker className="max-w-[284px]"
                                            label="Event date"
                                            onBlur={saveDate}
                                            onChange={(e) => setTempDate(e)}
                                            onKeyDown={(e) => e.key === 'Enter' && saveDate()}
                                            value={tempDate} />
                            ) : (
                                <>
                                    <Calendar className="w-4 h-4 text-zinc-600" />
                                    <span className="text-zinc-600">{formatDate(wishlist.eventDate)}</span>
                                    <button
                                        onClick={startEditingDate}
                                        className="p-1 hover:bg-zinc-100 rounded transition-colors"
                                        title="Edit event date"
                                    >
                                        <Pencil className="w-3 h-3 text-zinc-600 " />
                                    </button>
                                    {daysUntil >= 0 && (
                                        <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                                            {daysUntil === 0 ? "Today!" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
                                        </span>
                                    )}
                                    {daysUntil < 0 && (
                                        <span className="ml-2 px-2 py-0.5 bg-zinc-100 text-zinc-500 text-xs font-medium rounded-full">
                                        Past event
                                    </span>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4">
                            <Card>                            <CardBody className={"text-center"}>
                                <p className="text-small text-default-500 font-medium">Total Wish</p>
                                <p key={`total-${wishlist.items.length}`} className="text-default-700 text-2xl font-semibold stat-number">{wishlist.items.length}</p>
                            </CardBody>                        </Card>                        <Card>                            <CardBody className={"text-center"}>
                            <p className="text-small text-default-500 font-medium">Claimed</p>
                            <p key={`done-${wishlist.items.filter((item) => item.completed).length}`}
                               className="text-default-700 text-2xl font-semibold stat-number">{wishlist.items.filter((item) => item.completed).length}</p>
                        </CardBody>                        </Card>                        <Card>                            <CardBody className={"text-center"}>
                            <p className="text-small text-default-500 font-medium">Remaining</p>
                            <p key={`left-${wishlist.items.filter((item) => !item.completed).length}`}
                               className="text-default-700 text-2xl font-semibold stat-number">{wishlist.items.filter((item) => !item.completed).length}</p>
                        </CardBody>                        </Card>                    </div>

                        {/* Items List */}
                        <div className="max-w-screen space-y-2 px-4">
                            {wishlist.items.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-zinc-400 text-lg">No items yet</p>
                                    <p className="text-zinc-300 text-sm mt-2">Add your first item below</p>
                                </div>
                            ) : (
                                wishlist.items.map((item) => {
                                    const isExpanded = expandedItems.has(item.id);
                                    const hasDetails =
                                        item.link || item.description || item.price || item.category || item.tags?.length;

                                    return (
                                    <div
                                        key={item.id}
                                        className="group flex items-center gap-3 p-4 bg-zinc-50 hover:bg-zinc-100 rounded-xl transition-all duration-200 hover:shadow-md"
                                    >
                                        <Button
                                            isIconOnly
                                            onPress={() => handleToggleItem(item.id) }
                                            className={"shrink-0 transition-all duration-200 bg-transparent "}
                                        >
                                            {!item.completed ? (
                                                <Circle
                                                    className="w-5 h-5 text-zinc-500"
                                                    strokeWidth={2}
                                                />
                                            ) : (
                                                <CircleCheckBig
                                                    className="w-5 h-5 text-zinc-500"
                                                    strokeWidth={2}
                                                    style={{
                                                        strokeDasharray: 100,
                                                        strokeDashoffset: 0,
                                                        animation: "drawCheck 0.5s ease-out"
                                                    }}
                                                />
                                            )}
                                        </Button>

                                        <span
                                            className={`flex-1 text-zinc-800 transition-all duration-200 truncate 
                                                ${item.completed
                                                    ? "line-through text-zinc-400"
                                                    : ""
                                                }
                                            `}
                                        >
                                        {item.text}
                                        </span>

                                        {/*{item.priority && (*/}
                                        {/*    <span className={`text-xs px-1.5 py-0.5 rounded ${getPriorityColor(item.priority)}`}>*/}
                                        {/*                      {item.priority}*/}
                                        {/*                    </span>*/}
                                        {/*)}*/}

                                        {/*{item.price && (*/}
                                        {/*    <span className="text-xs text-zinc-600 flex items-center gap-1">*/}
                                        {/*                        <DollarSign className="w-3 h-3" />*/}
                                        {/*        {item.price.toFixed(2)} {item.currency}*/}
                                        {/*                    </span>*/}
                                        {/*)}*/}

                                        {/*{item.category && (*/}
                                        {/*    <span className="text-xs text-zinc-500 mt-1 block">{item.category}</span>*/}
                                        {/*)}*/}

                                        <Button
                                            isIconOnly
                                            onPress={() => handleDeleteItem(item.id)}
                                            className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 sm:p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 shrink-0 bg-transparent"
                                            title="Delete item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>

                                        {/*{hasDetails && (*/}
                                        {/*    <button*/}
                                        {/*        onClick={() => toggleExpand(item.id)}*/}
                                        {/*        className="p-1.5 sm:p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 flex-shrink-0"*/}
                                        {/*    >*/}
                                        {/*        {isExpanded ? (*/}
                                        {/*            <ChevronUp className="w-4 h-4" />*/}
                                        {/*        ) : (*/}
                                        {/*            <ChevronDown className="w-4 h-4" />*/}
                                        {/*        )}*/}
                                        {/*    </button>*/}
                                        {/*)}*/}

                                        {/*/!* Expanded Details *!/*/}
                                        {/*{isExpanded && hasDetails && (*/}
                                        {/*    <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0 space-y-2 border-t border-zinc-200">*/}
                                        {/*        {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}*/}

                                        {/*        {item.link && (*/}
                                        {/*            <a*/}
                                        {/*                href={item.link}*/}
                                        {/*                target="_blank"*/}
                                        {/*                rel="noopener noreferrer"*/}
                                        {/*                className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"*/}
                                        {/*            >*/}
                                        {/*                <ExternalLink className="w-3 h-3" />*/}
                                        {/*                View link*/}
                                        {/*            </a>*/}
                                        {/*        )}*/}

                                        {/*        {item.tags && item.tags.length > 0 && (*/}
                                        {/*            <div className="flex items-center gap-2 flex-wrap">*/}
                                        {/*                <Tag className="w-3 h-3 text-zinc-400" />*/}
                                        {/*                {item.tags.map((tag, idx) => (*/}
                                        {/*                    <span*/}
                                        {/*                        key={idx}*/}
                                        {/*                        className="text-xs px-2 py-0.5 bg-zinc-200 text-zinc-700 rounded"*/}
                                        {/*                    >*/}
                                        {/*                            {tag}*/}
                                        {/*                        </span>*/}
                                        {/*                ))}*/}
                                        {/*            </div>*/}
                                        {/*        )}*/}
                                        {/*    </div>*/}
                                        {/*)}*/}

                                    </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Add Item */}
                        {newItem ? (
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Add new item..."
                                    value={newItem}
                                    onChange={(e) => setNewItem(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAddItem();
                                        if (e.key === 'Escape') setNewItem('');
                                    }}
                                    onBlur={() => {
                                        if (newItem.trim()) handleAddItem();
                                        else setNewItem('');
                                    }}
                                    className="flex-1 px-4 py-3 rounded-xl "
                                />
                            </div>
                        ) : (
                            <Button color="primary" variant="ghost" onPress={() => setNewItem(" ")} isDisabled={isPending}>
                                + Add new item
                            </Button>
                        )}

                        {/*Saving Text*/}
                        {/*{isPending && <div className="mt-2 text-center text-sm text-zinc-500">Saving...</div>}*/}
                    </div>
                </main>
            </div>
        </HeroUIProvider>
        );
}