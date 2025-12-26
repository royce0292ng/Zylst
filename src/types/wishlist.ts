export interface Item {
    id: string;
    text: string;
    completed: boolean;
    position?: number;

    // New fields
    link?: string;                    // URL to product, website, etc.
    description?: string;             // Additional details/notes
    price?: number;                   // Price if it's a purchasable item
    currency?: string;                // Currency code (USD, EUR, etc.)
    imageUrl?: string;                // Image/thumbnail URL
    category?: string;                // Category (gift, task, purchase, etc.)
    priority?: 'low' | 'medium' | 'high';  // Priority level
    assignedTo?: string;              // User ID if assigned to someone
    dueDate?: string;                 // Due date for tasks
    tags?: string[];                  // Tags for organization

    createdAt: string;
    updatedAt: string;
}

export interface Wishlist {
    id: string;
    name: string;
    eventDate: string;
    items: Item[];
    userId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
}