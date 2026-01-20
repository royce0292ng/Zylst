'use client';

import { useState, useTransition, useEffect } from 'react';
import type { Wishlist } from '@/types/wishlist';
import {
    updateWishlist,
    addItem,
    toggleItem,
    deleteItem,
} from '@/app/actions/whislist';
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

export function WishlistClient({ wishlist: initialWishlist }: { wishlist: Wishlist }) {
    const [wishlist, setWishlist] = useState(initialWishlist);
    const [isPending, startTransition] = useTransition();
    const [newItem, setNewItem] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState('');
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [tempDate, setTempDate] = useState('');
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [animateStats, setAnimateStats] = useState({ total: false, done: false, left: false });

    const totalItems = wishlist.items.length;
    const completedItems = wishlist.items.filter((item) => item.completed).length;
    const remainingItems = wishlist.items.filter((item) => !item.completed).length;

    useEffect(() => {
        setAnimateStats({ total: true, done: true, left: true });
        const timer = setTimeout(() => {
            setAnimateStats({ total: false, done: false, left: false });
        }, 400);
        return () => clearTimeout(timer);
    }, [totalItems, completedItems, remainingItems]);

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
        setTempDate(wishlist.eventDate.toString().split('T')[0]);
        setIsEditingDate(true);
    };

    const saveDate = async () => {
        if (tempDate) {
            await handleDateChange(tempDate);
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
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 font-sans p-2 sm:p-4">
            <style>{`
        @keyframes drawCheck {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes countUp {
          0% { transform: translateY(10px) scale(0.8); opacity: 0; }
          50% { transform: translateY(-5px) scale(1.1); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .stat-number {
          display: inline-block;
          animation: countUp 0.4s ease-out;
        }
      `}</style>

            <main className="w-full max-w-2xl">
                <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-3 sm:mb-4">Zylst</h1>

                        {/* Event Name */}
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            {isEditingName ? (
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && saveName()}
                                    onBlur={saveName}
                                    className="text-xl sm:text-2xl font-semibold text-zinc-800 border-b-2 border-indigo-600 focus:outline-none bg-transparent pb-1 w-full"
                                    autoFocus
                                />
                            ) : (
                                <>
                                    <h2 className="text-xl sm:text-2xl font-semibold text-zinc-800 flex-1 min-w-0 break-words">
                                        {wishlist.name}
                                    </h2>
                                    <button
                                        onClick={startEditingName}
                                        className="p-1.5 sm:p-2 hover:bg-zinc-100 rounded-lg transition-colors flex-shrink-0"
                                    >
                                        <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 hover:text-indigo-600" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Event Date */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {isEditingDate ? (
                                <input
                                    type="date"
                                    value={tempDate}
                                    onChange={(e) => setTempDate(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && saveDate()}
                                    onBlur={saveDate}
                                    className="px-3 py-1 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-700 text-sm"
                                    autoFocus
                                />
                            ) : (
                                <>
                                    <Calendar className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                    <span className="text-sm sm:text-base text-zinc-600">
                    {formatDate(wishlist.eventDate)}
                  </span>
                                    <button
                                        onClick={startEditingDate}
                                        className="p-1 hover:bg-zinc-100 rounded transition-colors flex-shrink-0"
                                    >
                                        <Pencil className="w-3 h-3 text-zinc-400 hover:text-indigo-600" />
                                    </button>
                                    {daysUntil >= 0 && (
                                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                      {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                    </span>
                                    )}
                                    {daysUntil < 0 && (
                                        <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-xs font-medium rounded-full">
                      Past event
                    </span>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
                            <p className="text-xs sm:text-sm text-indigo-600 font-medium">Total</p>
                            <p className={`text-xl sm:text-2xl font-bold text-indigo-900 ${animateStats.total ? 'stat-number' : ''}`}>
                                {totalItems}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
                            <p className="text-xs sm:text-sm text-green-600 font-medium">Done</p>
                            <p className={`text-xl sm:text-2xl font-bold text-green-900 ${animateStats.done ? 'stat-number' : ''}`}>
                                {completedItems}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
                            <p className="text-xs sm:text-sm text-amber-600 font-medium">Left</p>
                            <p className={`text-xl sm:text-2xl font-bold text-amber-900 ${animateStats.left ? 'stat-number' : ''}`}>
                                {remainingItems}
                            </p>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2 mb-4">
                        {wishlist.items.length === 0 ? (
                            <div className="text-center py-8 sm:py-12">
                                <p className="text-zinc-400 text-base sm:text-lg">No items yet</p>
                                <p className="text-zinc-300 text-xs sm:text-sm mt-2">Add your first item below</p>
                            </div>
                        ) : (
                            wishlist.items.map((item) => {
                                const isExpanded = expandedItems.has(item.id);
                                const hasDetails =
                                    item.link || item.description || item.price || item.category || item.tags?.length;

                                return (
                                    <div
                                        key={item.id}
                                        className="group bg-zinc-50 hover:bg-zinc-100 rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-md overflow-hidden"
                                    >
                                        <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4">
                                            <button
                                                onClick={() => handleToggleItem(item.id)}
                                                className="flex-shrink-0 relative w-5 h-5"
                                            >
                                                {!item.completed ? (
                                                    <Circle className="w-5 h-5 text-zinc-300" strokeWidth={2} />
                                                ) : (
                                                    <CircleCheckBig
                                                        className="w-5 h-5 text-indigo-600"
                                                        strokeWidth={2}
                                                        style={{
                                                            strokeDasharray: 100,
                                                            strokeDashoffset: 0,
                                                            animation: 'drawCheck 0.5s ease-out',
                                                        }}
                                                    />
                                                )}
                                            </button>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                          <span
                              className={`text-sm sm:text-base text-zinc-800 transition-all duration-200 ${
                                  item.completed ? 'line-through text-zinc-400' : ''
                              }`}
                          >
                            {item.text}
                          </span>

                                                    {item.priority && (
                                                        <span className={`text-xs px-1.5 py-0.5 rounded ${getPriorityColor(item.priority)}`}>
                              {item.priority}
                            </span>
                                                    )}

                                                    {item.price && (
                                                        <span className="text-xs text-zinc-600 flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                                                            {item.price.toFixed(2)} {item.currency}
                            </span>
                                                    )}
                                                </div>

                                                {item.category && (
                                                    <span className="text-xs text-zinc-500 mt-1 block">{item.category}</span>
                                                )}
                                            </div>

                                            {hasDetails && (
                                                <button
                                                    onClick={() => toggleExpand(item.id)}
                                                    className="p-1.5 sm:p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 flex-shrink-0"
                                                >
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleDeleteItem(item.id)}
                                                className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 sm:p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Expanded Details */}
                                        {isExpanded && hasDetails && (
                                            <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0 space-y-2 border-t border-zinc-200">
                                                {item.description && <p className="text-sm text-zinc-600">{item.description}</p>}

                                                {item.link && (
                                                    <a
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                                                    >
                                                    <ExternalLink className="w-3 h-3" />
                                                    View link
                                                    </a>
                                                    )}

                                                {item.tags && item.tags.length > 0 && (
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <Tag className="w-3 h-3 text-zinc-400" />
                                                        {item.tags.map((tag, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="text-xs px-2 py-0.5 bg-zinc-200 text-zinc-700 rounded"
                                                            >
                                {tag}
                              </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Add Item */}
                    {newItem ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Add new item..."
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleAddItem();
                                    if (e.key === 'Escape') setNewItem('');
                                }}
                                onBlur={() => {
                                    if (newItem.trim()) handleAddItem();
                                    else setNewItem('');
                                }}
                                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-indigo-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                                autoFocus
                            />
                        </div>
                    ) : (
                        <button
                            onClick={() => setNewItem(' ')}
                            className="w-full py-3 sm:py-4 text-sm sm:text-base text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg sm:rounded-xl transition-all duration-200 font-medium border-2 border-dashed border-indigo-200 hover:border-indigo-400"
                            disabled={isPending}
                        >
                            + Add new item
                        </button>
                    )}

                    {isPending && <div className="mt-2 text-center text-sm text-zinc-500">Saving...</div>}
                </div>
            </main>
        </div>
    );
}