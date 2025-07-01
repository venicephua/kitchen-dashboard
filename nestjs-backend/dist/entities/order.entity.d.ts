export interface OrderItems {
    name: string;
    quantity: number;
}
export declare class Order {
    id: number;
    items: OrderItems;
    status: 'Pending' | 'Received' | 'Completed';
    createdAt: Date;
    updatedAt: Date;
    get isCompleted(): boolean;
}
