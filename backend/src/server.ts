import express from "express";
import cors from "cors";
import { createOrder, getOrders, updateOrder } from "./orders";
import amqp from "amqplib";

const app = express();
app.use(cors());
app.use(express.json());

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://192.168.6.107"; 
let channel: amqp.Channel;

async function connectToRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    
    const receiveQueue = "orders";
    await channel.assertQueue(receiveQueue, { durable: false });
    console.log(`Waiting for messages in queue: ${receiveQueue}`);

    const sendQueue = "orderStatus";
    await channel.assertQueue(sendQueue, { durable: false });
    console.log(`Connected to send queue: ${sendQueue}`);

  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
}

app.post("/api/orders", (req, res) => {
  const order = req.body.items;

  createOrder(order);
  console.log("Order created:", order);
  res.status(201).json({ message: "Order created successfully", order });
});

async function startOrderConsumer() {
    channel.consume('orders', async (msg) => {
    if (msg !== null) {
      const order = JSON.parse(msg.content.toString());
      createOrder(order);
      console.log("Order received and created:", order);
      channel.ack(msg);
    } else {
      console.log("No message received");
    }
  }); 
}

connectToRabbitMQ().then(startOrderConsumer).catch(console.error);

app.get("/api/orders", (req, res) => {
  const orders = getOrders();
  if (orders) {
    res.status(200).json(orders);
  } else {
    res.status(404).json({ message: "No orders found" });
  }
});

app.patch("/api/orders/:id/update", (req, res) => {
  const orderId = parseInt(req.params.id, 10);
  const orderStatus = req.body.status;
  const statusMsg = updateOrder(orderId, orderStatus);
  
  const statusUpdate = { orderId, status: statusMsg };
  channel.sendToQueue("orderStatus", Buffer.from(JSON.stringify(statusUpdate)));

  console.log(`Order ${orderId} status updated successfully`);
  res.json({ message: `Order ${orderId} status updated successfully` });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
