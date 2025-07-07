import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrderCreationService } from './order-creation.service';
import { OrderRetrievalService } from './order-retrieval.service';
import { OrderUpdateService } from './order-update.service';
import { OrderStreamService } from './order-stream.service';
import { Order } from '../entities/order.entity';
import { OrderVisibilityService } from './order-visibility.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [OrdersController],
  providers: [OrderCreationService, OrderRetrievalService, OrderUpdateService, OrderStreamService, OrderVisibilityService, RabbitMQService],
  exports: [OrderCreationService, OrderRetrievalService, OrderUpdateService, OrderStreamService, OrderVisibilityService],
})
export class OrdersModule {}
