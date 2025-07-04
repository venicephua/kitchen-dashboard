import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order, OrderItems } from "../entities/order.entity";
import { Subject } from "rxjs";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>
  ) {}

  private orderUpdateSubject = new Subject<any>();

  getOrderStream() {
    return this.orderUpdateSubject.asObservable();
  }

  broadcastOrderUpdate(type: string, order?: Order, orderId?: number) {
    const data = { type, order, orderId };
    this.orderUpdateSubject.next(data);
  }

  async create(orderData: { items: OrderItems }): Promise<Order> {
    const order = this.ordersRepository.create({
      items: orderData.items,
      status: "Pending",
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Broadcast the order creation event
    this.broadcastOrderUpdate("order_created", savedOrder);
    
    console.log("Order created in database:", savedOrder);
    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.ordersRepository.find({
      order: { id: "ASC" },
    });

    return orders.map((order) => ({
      ...order,
      isCompleted: order.status === "Completed",
    }));
  }

  async updateStatus(
    id: number,
    status: "Pending" | "Received" | "Completed"
  ): Promise<Order> {
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
    
    // Broadcast the order update event
    this.broadcastOrderUpdate('order_updated', updatedOrder);

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
