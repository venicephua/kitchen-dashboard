import { writable } from 'svelte/store';
import { fetchOrders, updateOrder } from '$lib/api';

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

  // Refresh orders from API
  refresh: async () => {
    try {
      const orders = await fetchOrders();
      ordersStore.set(orders);
      return orders;
    } catch (error) {
      console.error('Failed to refresh orders:', error);
      return [];
    }
  },

  // Update order and refresh
  updateOrder: async (id: number, status: "Pending" | "Received" | "Completed") => {
    try {
      await updateOrder(id, status);
      await ordersActions.refresh();
    } catch (error) {
      console.error('Failed to update order:', error);
      throw error;
    }
  }
};