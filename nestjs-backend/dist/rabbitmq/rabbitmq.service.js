"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RabbitMQService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQService = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("../orders/orders.service");
const amqplib_1 = require("amqplib");
let RabbitMQService = RabbitMQService_1 = class RabbitMQService {
    constructor(ordersService) {
        this.ordersService = ordersService;
        this.logger = new common_1.Logger(RabbitMQService_1.name);
    }
    async onModuleInit() {
        await this.connectToRabbitMQ();
        await this.startOrderConsumer();
    }
    async connectToRabbitMQ() {
        try {
            const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://192.168.6.86';
            this.logger.log(`Connecting to RabbitMQ at ${RABBITMQ_URL}`);
            const connection = await amqplib_1.default.connect(RABBITMQ_URL);
            this.channel = await connection.createChannel();
            const receiveQueue = "orders";
            await this.channel.assertQueue(receiveQueue, { durable: false });
            this.logger.log(`Waiting for messages in queue: ${receiveQueue}`);
            const sendQueue = "orderStatus";
            await this.channel.assertQueue(sendQueue, { durable: false });
            this.logger.log(`Connected to send queue: ${sendQueue}`);
        }
        catch (error) {
            this.logger.error('Failed to connect to RabbitMQ:', error);
            throw error;
        }
    }
    async startOrderConsumer() {
        this.channel.consume('orders', async (msg) => {
            if (msg !== null) {
                try {
                    const order = JSON.parse(msg.content.toString());
                    const savedOrder = await this.ordersService.create(order);
                    this.logger.log('Order received from RabbitMQ and saved to database:', savedOrder);
                    this.channel.ack(msg);
                }
                catch (error) {
                    this.logger.error('Error processing order from RabbitMQ:', error);
                    this.channel.nack(msg, false, false);
                }
            }
            else {
                this.logger.log('No message received from RabbitMQ');
            }
        });
    }
    async sendOrderStatus(orderId, status) {
        try {
            const statusUpdate = { orderId, status };
            this.channel.sendToQueue('orderStatus', Buffer.from(JSON.stringify(statusUpdate)));
            this.logger.log(`Sent order status update to RabbitMQ:`, statusUpdate);
        }
        catch (error) {
            this.logger.error('Error sending order status to RabbitMQ:', error);
            throw error;
        }
    }
};
exports.RabbitMQService = RabbitMQService;
exports.RabbitMQService = RabbitMQService = RabbitMQService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], RabbitMQService);
//# sourceMappingURL=rabbitmq.service.js.map