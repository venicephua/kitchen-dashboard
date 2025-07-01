import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';
import { Order } from './entities/order.entity';

@Module({
  imports: [
    // Database configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'kitchen_user',
      password: process.env.DB_PASSWORD || 'kitchen_pass',
      database: process.env.DB_NAME || 'kitchen_db',
      entities: [Order],
      synchronize: true, // Only for development - creates tables automatically
      logging: true, // Log SQL queries for debugging
    }),
    OrdersModule,
  ],
})
export class AppModule {}
