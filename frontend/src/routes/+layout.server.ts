import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ fetch }) => {
    try {
        console.log('Layout SSR: Loading all orders data...');
        const response = await fetch('/api/orders');
        
        if (!response.ok) {
            console.error(`Layout SSR: Failed to fetch orders - HTTP ${response.status}`);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const orders = await response.json();
        console.log(`Layout SSR: Successfully loaded ${orders.length} orders`);
        
        return {
            orders: orders || []
        };
    } catch (error) {
        console.error('Layout SSR: Error loading orders:', error);
        // Return empty array as fallback
        return {
            orders: []
        };
    }
};