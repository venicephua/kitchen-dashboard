export async function fetchOrders() {
    const res = await fetch('http://localhost:3001/orders');
    return res.json();
}

export async function updateOrder(orderId: number) {
    const res = await fetch(`http://localhost:3001/orders/${orderId}/update`, {
        method: 'PATCH',
    });
    if (!res.ok) {
        throw new Error('Failed to receive or complete order');
    }
    return res.text();
}
