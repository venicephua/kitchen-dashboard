import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, Sse } from '@nestjs/common';
import { OrderCreationService } from './order-creation.service';
import { OrderRetrievalService } from './order-retrieval.service';
import { OrderUpdateService } from './order-update.service';
import { OrderStreamService } from './order-stream.service'; 
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// DTOs for request validation
export class CreateOrderDto {
  items: {
    name: string;
    quantity: number;
  };
}

export class UpdateOrderDto {
  status: 'Pending' | 'Received' | 'Completed';
}

@Controller('api/orders')
export class OrdersController {
  constructor(
    private readonly orderCreationService: OrderCreationService,
    private readonly orderRetrievalService: OrderRetrievalService,
    private readonly orderUpdateService: OrderUpdateService,
    private readonly orderStreamService: OrderStreamService, // Assuming you have an OrderStreamService for SSE
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  /**
   * POST /api/orders - Create a new order
   * Replaces: app.post("/api/orders", ...)
   */
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.orderCreationService.create(createOrderDto);
    return { 
      message: 'Order created successfully', 
      order 
    };
  }

  /**
   * GET /api/orders - Get all orders
   * Replaces: app.get("/api/orders", ...)
   */
  @Get()
  async getOrders() {
    const orders = await this.orderRetrievalService.findAll();
    
    if (orders.length === 0) {
      return [];
    }
    
    return orders;
  }

  /**
   * GET /api/orders/stream - Server-Sent Events endpoint for real-time updates
   */
  @Sse('stream')
  streamOrders(): Observable<any> {
    return this.orderStreamService.getOrderStream().pipe(
      map((data) => ({ data: JSON.stringify(data) })),
      startWith({ data: JSON.stringify({ type: 'connected' }) })
    );
  }

  /**
   * PATCH /api/orders/:id/update - Update order status
   * Replaces: app.patch("/api/orders/:id/update", ...)
   */
  @Patch(':id')
  async updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    const order = await this.orderUpdateService.updateStatus(id, updateOrderDto.status);
    await this.rabbitMQService.sendOrderStatus(id, updateOrderDto.status);
    
    return { 
      message: `Order ${id} status updated successfully`,
      order 
    };
  }
}
