import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStreamService } from './order-stream.service';
import { Repository } from 'typeorm';
import { Order, OrderItems } from '../entities/order.entity';

@Injectable()
export class OrderCreationService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private orderStreamService: OrderStreamService,
  ) {}

  async create(orderData: { items: OrderItems }): Promise<Order> {
    const order = this.ordersRepository.create({
      items: orderData.items,
      status: 'Pending',
    });

    const savedOrder = await this.ordersRepository.save(order);
    this.orderStreamService.broadcastOrderUpdate("order_created", savedOrder);
    console.log('Order created in database:', savedOrder);
    return savedOrder;
  }
}
