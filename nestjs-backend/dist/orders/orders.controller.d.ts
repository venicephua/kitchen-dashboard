import { OrdersService } from './orders.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
export declare class CreateOrderDto {
    items: {
        name: string;
        quantity: number;
    };
}
export declare class UpdateOrderDto {
    status: 'Pending' | 'Received' | 'Completed';
}
export declare class OrdersController {
    private readonly ordersService;
    private readonly rabbitMQService;
    constructor(ordersService: OrdersService, rabbitMQService: RabbitMQService);
    createOrder(createOrderDto: CreateOrderDto): Promise<{
        message: string;
        order: import("../entities/order.entity").Order;
    }>;
    getOrders(): Promise<import("../entities/order.entity").Order[]>;
    updateOrder(id: number, updateOrderDto: UpdateOrderDto): Promise<{
        message: string;
        order: import("../entities/order.entity").Order;
    }>;
}
