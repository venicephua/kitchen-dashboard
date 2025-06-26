type Order = {
  id: number;
  items: Item[];
  status: "Pending" | "Received" | "Completed";
  isCompleted: boolean; 
};

type Item = {
  name: string;
  quantity: number;
};

const orders: Order[] = [];

export function createOrder(items: Item[]): Order {
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
  return orders.length > 0 ? orders : undefined;
}

export function updateOrder(orderId: number) {
    const order = orders.find(o => o.id === orderId);
    if (order && order.status === "Pending") {
        order.status = "Received";
    } else if (order && order.status === "Received") {
        order.status = "Completed";
        order.isCompleted = true;
    }
}