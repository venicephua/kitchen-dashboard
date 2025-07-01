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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = exports.UpdateOrderDto = exports.CreateOrderDto = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const rabbitmq_service_1 = require("../rabbitmq/rabbitmq.service");
class CreateOrderDto {
}
exports.CreateOrderDto = CreateOrderDto;
class UpdateOrderDto {
}
exports.UpdateOrderDto = UpdateOrderDto;
let OrdersController = class OrdersController {
    constructor(ordersService, rabbitMQService) {
        this.ordersService = ordersService;
        this.rabbitMQService = rabbitMQService;
    }
    async createOrder(createOrderDto) {
        const order = await this.ordersService.create(createOrderDto);
        return {
            message: 'Order created successfully',
            order
        };
    }
    async getOrders() {
        const orders = await this.ordersService.findAll();
        if (orders.length === 0) {
            return [];
        }
        return orders;
    }
    async updateOrder(id, updateOrderDto) {
        const order = await this.ordersService.updateStatus(id, updateOrderDto.status);
        await this.rabbitMQService.sendOrderStatus(id, updateOrderDto.status);
        return {
            message: `Order ${id} status updated successfully`,
            order
        };
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Patch)(':id/update'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateOrder", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('api/orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        rabbitmq_service_1.RabbitMQService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map