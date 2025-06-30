const API_BASE_URL = '/api';

export async function fetchOrders() {
    const res = await fetch(`${API_BASE_URL}/orders`);
    return res.json();
}

export async function updateOrder(orderId: number, orderStatus: "Pending" | "Received" | "Completed") {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/update`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: orderStatus }),
    });
    if (!res.ok) {
        throw new Error('Failed to receive or complete order');
    }
    return res.text();
}
