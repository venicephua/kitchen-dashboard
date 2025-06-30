"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const orders_1 = require("./orders");
const amqplib_1 = __importDefault(require("amqplib"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://192.168.6.107";
let channel;
function connectToRabbitMQ() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield amqplib_1.default.connect(RABBITMQ_URL);
            channel = yield connection.createChannel();
            const receiveQueue = "orders";
            yield channel.assertQueue(receiveQueue, { durable: false });
            console.log(`Waiting for messages in queue: ${receiveQueue}`);
            const sendQueue = "orderStatus";
            yield channel.assertQueue(sendQueue, { durable: false });
            console.log(`Connected to send queue: ${sendQueue}`);
        }
        catch (error) {
            console.error("Failed to connect to RabbitMQ:", error);
            throw error;
        }
    });
}
app.post("/orders", (req, res) => {
    const order = req.body.items;
    (0, orders_1.createOrder)(order);
    console.log("Order created:", order);
    res.status(201).json({ message: "Order created successfully", order });
});
function startOrderConsumer() {
    return __awaiter(this, void 0, void 0, function* () {
        channel.consume('orders', (msg) => __awaiter(this, void 0, void 0, function* () {
            if (msg !== null) {
                const order = JSON.parse(msg.content.toString());
                (0, orders_1.createOrder)(order);
                console.log("Order received and created:", order);
                channel.ack(msg);
            }
            else {
                console.log("No message received");
            }
        }));
    });
}
connectToRabbitMQ().then(startOrderConsumer).catch(console.error);
app.get("/orders", (req, res) => {
    const orders = (0, orders_1.getOrders)();
    if (orders) {
        res.status(200).json(orders);
    }
    else {
        res.status(404).json({ message: "No orders found" });
    }
});
app.patch("/orders/:id/update", (req, res) => {
    const orderId = parseInt(req.params.id, 10);
    const orderStatus = req.body.status;
    const statusMsg = (0, orders_1.updateOrder)(orderId, orderStatus);
    const statusUpdate = { orderId, status: statusMsg };
    channel.sendToQueue("orderStatus", Buffer.from(JSON.stringify(statusUpdate)));
    console.log(`Order ${orderId} status updated successfully`);
    res.json({ message: `Order ${orderId} status updated successfully` });
});
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
