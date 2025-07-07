import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderStreamService } from './order-stream.service';

@Injectable()
export class OrderVisibilityService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private orderStreamService: OrderStreamService,
  ) {}

  async hideOrder(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    await this.ordersRepository.update(id, { isVisible: false });
    const updatedOrder = await this.ordersRepository.findOne({ where: { id } });
    
    this.orderStreamService.broadcastOrderUpdate('order_hidden', updatedOrder);
    console.log(`Order ${id} hidden from view`);
    
    return updatedOrder;
  }
}