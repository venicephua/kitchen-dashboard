import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { OrderCreationService } from '../orders/order-creation.service';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQService.name);
  private channel: amqp.Channel;
  
  constructor(private orderCreationService: OrderCreationService) {}

  /**
   * Initialize RabbitMQ connection when the module starts
   */
  async onModuleInit() {
    try {
      await this.connectToRabbitMQ();
      await this.startOrderConsumer();
    } catch (error) {
      this.logger.warn('RabbitMQ not available - continuing without message queue functionality');
      this.logger.warn('This is normal for development without RabbitMQ running');
    }
  }

  /**
   * Connect to RabbitMQ - same as the original function
   */
  private async connectToRabbitMQ() {
    try {
      const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://192.168.6.92';
      this.logger.log(`Connecting to RabbitMQ at ${RABBITMQ_URL}`);
      
      const connection = await amqp.connect(RABBITMQ_URL);
      this.channel = await connection.createChannel();
      
      // Assert queues (same as the original code)
      const receiveQueue = "orders";
      await this.channel.assertQueue(receiveQueue, { durable: false });
      this.logger.log(`Waiting for messages in queue: ${receiveQueue}`);

      const sendQueue = "orderStatus";
      await this.channel.assertQueue(sendQueue, { durable: false });
      this.logger.log(`Connected to send queue: ${sendQueue}`);
      
      this.logger.log('RabbitMQ connection established successfully');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  /**
   * Start consuming orders from RabbitMQ
   */
  private async startOrderConsumer() {
    if (!this.channel) {
      this.logger.error('Cannot start consumer - no channel available');
      return;
    }

    this.logger.log('Setting up order consumer for queue: orders');
    
    this.channel.consume('orders', async (msg) => {
      if (msg !== null) {
        this.logger.log('Message received from RabbitMQ queue');
        
        try {
          const messageData = JSON.parse(msg.content.toString());
          this.logger.log('Message data:', messageData);

          // Handle different message formats
          let orderData;
          if (messageData.items) {
            orderData = messageData;
          } else if (messageData.name && messageData.quantity) {
            orderData = { 
              items: {
                name: messageData.name,
                quantity: messageData.quantity
              }
            };
          } else {
            throw new Error(`Invalid message format`);
          }
          
          const savedOrder = await this.orderCreationService.create(orderData);
          this.logger.log(`Order processed: ${savedOrder.items.name} x${savedOrder.items.quantity} (ID: ${savedOrder.id})`);
          
          // Acknowledge the message
          this.channel.ack(msg);
        } catch (error) {
          this.logger.error('Error processing message:', error.message);
          this.channel.nack(msg, false, false);
        }
      } else {
        this.logger.warn('No message received from RabbitMQ');
      }
    }, {
      noAck: false // Ensure we're using manual acknowledgment
    });
    
    this.logger.log('Consumer started - waiting for messages...');
  }

  /**
   * Send order status update to RabbitMQ
   * Replaces channel.sendToQueue() calls
   */
  async sendOrderStatus(orderId: number, status: string) {
    if (!this.channel) {
      this.logger.warn('RabbitMQ not connected - skipping status update');
      return;
    }
    
    try {
      const statusUpdate = { orderId, status };
      this.channel.sendToQueue('orderStatus', Buffer.from(JSON.stringify(statusUpdate)));
      this.logger.log(`Sent order status update to RabbitMQ:`, statusUpdate);
    } catch (error) {
      this.logger.error('Error sending order status to RabbitMQ:', error);
      throw error;
    }
  }
}
