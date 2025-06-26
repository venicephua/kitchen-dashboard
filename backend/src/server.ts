import express from "express";
import cors from "cors";
import { createOrder, getOrders, updateOrder } from "./orders";

const app = express();
app.use(cors());
app.use(express.json());

const amqp = require("amqplib");
const RABBITMQ_URL = "amqp://localhost";

let channel;

async function connectToRabbitMQ(orderId: number) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
    await channel.assertQueue("orderStatus", { durable: true });
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
}

app.post("/orders", (req, res) => {
  const order = req.body.items;

  createOrder(order);
  console.log("Order created:", order);
  res.status(201).json({ message: "Order created successfully", order });
});

app.get("/orders", (req, res) => {
  const orders = getOrders();
  if (orders) {
    console.log("Orders retrieved:", JSON.stringify(orders, null, 2));
    res.status(200).json(orders);
  } else {
    console.log("No orders found");
    res.status(404).json({ message: "No orders found" });
  }
});

app.patch("/orders/:id/update", (req, res) => {
  const orderId = parseInt(req.params.id, 10);
  updateOrder(orderId);
  
  res.json({ message: `Order ${orderId} received successfully` });
});

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
