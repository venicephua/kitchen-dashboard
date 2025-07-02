import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ fetch }) => {
	try {
		console.log('SSR: Loading orders data...');
		const response = await fetch('/api/orders');
		
		if (!response.ok) {
			console.error(`SSR: Failed to fetch orders - HTTP ${response.status}`);
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}
		
		const orders = await response.json();
		console.log(`SSR: Successfully loaded ${orders.length} orders`);
		
		return {
			orders: orders || []
		};
	} catch (error) {
		console.error('SSR: Error loading orders:', error);
		// Return empty array as fallback - app will still work with client-side polling
		return {
			orders: []
		};
	}
};
