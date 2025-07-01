import { Repository } from 'typeorm';
import { Order, OrderItems } from '../entities/order.entity';
export declare class OrdersService {
    private ordersRepository;
    constructor(ordersRepository: Repository<Order>);
    create(orderData: {
        items: OrderItems;
    }): Promise<Order>;
    findAll(): Promise<Order[]>;
    updateStatus(id: number, status: 'Pending' | 'Received' | 'Completed'): Promise<Order>;
    findOne(id: number): Promise<Order>;
}
