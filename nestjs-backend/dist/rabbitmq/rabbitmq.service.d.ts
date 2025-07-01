import { OnModuleInit } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
export declare class RabbitMQService implements OnModuleInit {
    private ordersService;
    private readonly logger;
    private channel;
    constructor(ordersService: OrdersService);
    onModuleInit(): Promise<void>;
    private connectToRabbitMQ;
    private startOrderConsumer;
    sendOrderStatus(orderId: number, status: string): Promise<void>;
}
