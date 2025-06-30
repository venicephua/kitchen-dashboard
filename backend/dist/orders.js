"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.getOrders = getOrders;
exports.updateOrder = updateOrder;
const orders = [];
function createOrder(items) {
    const newOrder = {
        id: orders.length + 1,
        items,
        status: "Pending",
        isCompleted: false
    };
    orders.push(newOrder);
    return newOrder;
}
function getOrders() {
    return orders.length > 0 ? orders : undefined;
}
function updateOrder(orderId, orderStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = orderStatus;
        if (orderStatus === 'Completed') {
            order.isCompleted = true;
        }
        else {
            order.isCompleted = false;
        }
        return orderStatus;
    }
    return `Order ${orderId} not found`;
}
