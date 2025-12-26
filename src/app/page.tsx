"use client"

import {Card, HeroUIProvider, CardBody, DatePicker, CalendarDate, Button, Input} from "@heroui/react";
import {Calendar, Circle, CircleCheckBig, Pencil, Trash2} from "lucide-react";
import React, {useState} from "react";
import {parseDate} from "@internationalized/date";

interface Item {
    id: string;
    text: string;
    completed: boolean;
}

interface Wishlist {
    id: string;
    name: string;
    eventDate: string;
    items: Item[];
    createdAt: string;
    updatedAt: string;
}

export default function Home() {

    const [wishlist, setWishlist] = useState<Wishlist>({
        id: "wishlist_1",
        name: "Birthday Party",
        eventDate: "2025-12-25",
        items: [
            { id: "1", text: "Blessing", completed: false },
            { id: "2", text: "Cake", completed: true },
            { id: "3", text: "ToyCar", completed: false },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [tempName, setTempName] = useState<string>("");
    const [isEditingDate, setIsEditingDate] = useState<boolean>(false);
    const [tempDate, setTempDate] = useState<string>("");
    const [newItem, setNewItem] = useState<string>("");

    const updateWishlist = (updates: Partial<Wishlist>) => {
        setWishlist({
            ...wishlist,
            ...updates,
            updatedAt: new Date().toISOString(),
        });
    };

    const addItem = () => {
        if (newItem.trim() === "") return;

        const item: Item = {
            id: Date.now().toString(),
            text: newItem,
            completed: false,
        };

        updateWishlist({
            items: [...wishlist.items, item],
        });
        setNewItem("");
    };

    const removeItem = (id: string) => {
        updateWishlist({
            items: wishlist.items.filter((item) => item.id !== id),
        });
    };

    const toggleComplete = (id: string) => {
        updateWishlist({
            items: wishlist.items.map((item) =>
                item.id === id ? { ...item, completed: !item.completed } : item
            ),
        });
    };

    const startEditingName = () => {
        setTempName(wishlist.name);
        setIsEditingName(true);
    };

    const saveName = () => {
        if (tempName.trim() !== "") {
            updateWishlist({ name: tempName });
        }
        setIsEditingName(false);
    };

    const startEditingDate = () => {

        setIsEditingDate(true);
    };

    const saveDate = () => {
        if (tempDate) {
            updateWishlist({ eventDate: tempDate });
            console.log(tempDate);
        }
        setIsEditingDate(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getDaysUntil = (dateString: string) => {
        const eventDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        const diffTime = eventDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
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
                                onKeyDown={(e) => e.key === "Enter" && saveName()}
                                onBlur={saveName}
                                className="px-3 py-1 border border-zinc-300 rounded font-medium text-zinc-950 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                autoFocus
                            />
                        ) : (
                            <>
                                <p className="font-medium text-zinc-950 dark:text-zinc-50">{wishlist.name}</p>
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
                    <div>
                        {isEditingDate ? (
                            <DatePicker className="max-w-[284px]"
                                        label="Event date"
                                        onBlur={saveDate}
                                        onChange={(date:CalendarDate | null) => {
                                            updateWishlist({ eventDate: date ? date.toString() : "" });
                                            setIsEditingDate(false);
                                        }}
                                        value={parseDate(wishlist.eventDate)} />
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
                        <Card>
                            <CardBody className={"text-center"}>
                                <p className="text-small text-default-500 font-medium">Total Wish</p>
                                <p key={`total-${wishlist.items.length}`} className="text-default-700 text-2xl font-semibold stat-number">{wishlist.items.length}</p>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody className={"text-center"}>
                                <p className="text-small text-default-500 font-medium">Claimed</p>
                                <p key={`done-${wishlist.items.filter((item) => item.completed).length}`}
                                   className="text-default-700 text-2xl font-semibold stat-number">{wishlist.items.filter((item) => item.completed).length}</p>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody className={"text-center"}>
                                <p className="text-small text-default-500 font-medium">Remaining</p>
                                <p key={`left-${wishlist.items.filter((item) => !item.completed).length}`}
                                   className="text-default-700 text-2xl font-semibold stat-number">{wishlist.items.filter((item) => !item.completed).length}</p>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Items List */}
                    <div className="max-w-screen space-y-2 px-4">
                        {wishlist.items.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-zinc-400 text-lg">No items yet</p>
                                <p className="text-zinc-300 text-sm mt-2">Add your first item below</p>
                            </div>
                        ) : (
                            wishlist.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="group flex items-center gap-3 p-4 bg-zinc-50 hover:bg-zinc-100 rounded-xl transition-all duration-200 hover:shadow-md"
                                >
                                    <Button
                                        isIconOnly
                                        onPress={() => toggleComplete(item.id) }
                                        className={"flex-shrink-0 transition-all duration-200 bg-transparent "}
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
                                        className={`flex-1 text-zinc-800 transition-all duration-200 truncate ${
                                            item.completed
                                                ? "line-through text-zinc-400"
                                                : ""
                                        }`}
                                    >
                                        {item.text}
                                    </span>

                                    <Button
                                        isIconOnly
                                        onPress={() => removeItem(item.id)}
                                        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 sm:p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0 bg-transparent"
                                        title="Delete item"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))
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
                                    if (e.key === "Enter") addItem();
                                    if (e.key === "Escape") setNewItem("");
                                }}
                                onBlur={() => {
                                    if (newItem.trim()) addItem();
                                    else setNewItem("");
                                }}
                                className="flex-1 px-4 py-3 rounded-xl "
                            />
                        </div>
                    ) : (
                        <Button color="primary" variant="ghost" onPress={() => setNewItem(" ")}>
                            + Add new item
                        </Button>
                    )}
                </div>
            </main>
        </div>
    </HeroUIProvider>
  );
}
