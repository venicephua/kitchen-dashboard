import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStreamService } from './order-stream.service'; // Assuming you have an OrderStreamService for SSE
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderUpdateService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private orderStreamService: OrderStreamService,
  ) {}

  async updateStatus(id: number, status: 'Pending' | 'Received' | 'Completed'): Promise<Order> {
    // Check if order exists
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Update the status
    await this.ordersRepository.update(id, { status });

    // Return updated order
    const updatedOrder = await this.ordersRepository.findOne({ where: { id } });
    console.log(`Order ${id} status updated to ${status}`);

    this.orderStreamService.broadcastOrderUpdate("order_updated", updatedOrder);

    return updatedOrder;
  }
}
