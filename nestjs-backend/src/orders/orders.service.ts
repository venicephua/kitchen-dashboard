import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItems } from '../entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async create(orderData: { items: OrderItems }): Promise<Order> {
    const order = this.ordersRepository.create({
      items: orderData.items,
      status: 'Pending'
    });
    
    const savedOrder = await this.ordersRepository.save(order);
    console.log('Order created in database:', savedOrder);
    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.ordersRepository.find({
      order: { createdAt: 'DESC' }
    });
    
    return orders.map(order => ({
      ...order,
      isCompleted: order.status === 'Completed'
    }));
  }

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
    
    return updatedOrder;
  }

  /**
   * Find a single order by ID
   */
  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    
    return order;
  }
}
