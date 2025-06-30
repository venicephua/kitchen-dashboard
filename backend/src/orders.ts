type Order = {
  id: number;
  items: Item;
  status: "Pending" | "Received" | "Completed";
  isCompleted: boolean; 
};

type Item = {
  name: string;
  quantity: number;
};

const orders: Order[] = [];

export function createOrder(items: Item): Order {
  const newOrder: Order = {
    id: orders.length + 1,
    items,
    status: "Pending",
    isCompleted: false
  };
  orders.push(newOrder);
  return newOrder;
}

export function getOrders(): Order[] | undefined {
  return orders.length > 0 ? orders : [];
}

export function updateOrder(orderId: number, orderStatus: "Pending" | "Received" | "Completed"): string {
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