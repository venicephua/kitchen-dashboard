import { writable } from 'svelte/store';
import { updateOrder } from '$lib/api';

export interface Order {
  id: number;
  items: {
    name: string;
    quantity: number;
  };
  status: "Pending" | "Received" | "Completed";
  isCompleted: boolean;
}

// Create the store
export const ordersStore = writable<Order[]>([]);

// Store actions
export const ordersActions = {
  // Initialize with SSR data
  initialize: (initialOrders: Order[]) => {
    ordersStore.set(initialOrders);
  },

  // Update order
  updateOrder: async (id: number, status: "Pending" | "Received" | "Completed") => {
    try {
      await updateOrder(id, status);
      // SSE will broadcast the update to all clients
    } catch (error) {
      console.error('Failed to update order:', error);
      throw error;
    }
  },

  // Handle SSE updates
  handleOrderUpdate: (update: { type: string; order?: Order; orderId?: number }) => {
    ordersStore.update(orders => {
      switch (update.type) {
        case 'order_created':
          if (update.order) {
            return [...orders, {
              ...update.order,
              isCompleted: update.order.status === 'Completed'
            }];
          }
          return orders;
        case 'order_updated':
          if (update.order) {
            return orders.map(order => 
              order.id === update.order!.id ? {
                ...update.order!,
                isCompleted: update.order!.status === 'Completed'
              } : order
            );
          }
          return orders;
        case 'order_deleted':
          if (update.orderId) {
            return orders.filter(order => order.id !== update.orderId);
          }
          return orders;
        case 'heartbeat':
        case 'connected':
          // Keep connection alive, no action needed
          return orders;
        default:
          return orders;
      }
    });
  }
};