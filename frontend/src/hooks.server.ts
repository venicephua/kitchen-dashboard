import type { Handle } from '@sveltejs/kit';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export const handle: Handle = async ({ event, resolve }) => {
	// Proxy API requests to the backend
	if (event.url.pathname.startsWith('/api')) {
		const backendUrl = `${BACKEND_URL}${event.url.pathname}${event.url.search}`;
		
		const response = await fetch(backendUrl, {
			method: event.request.method,
			headers: event.request.headers,
			body: event.request.method !== 'GET' && event.request.method !== 'HEAD' 
				? await event.request.arrayBuffer() 
				: undefined
		});

		// Return the response from the backend
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers
		});
	}

	// Handle all other requests normally
	return resolve(event);
};
