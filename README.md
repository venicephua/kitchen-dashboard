# Kitchen Dashboard 🍽️

A real-time kitchen order management system built with Svelte frontend and Node.js backend, featuring RabbitMQ integration for order processing. Part 2 of a two-part application for an Ordering and Order Management system. 

## 🚀 Features

- **Real-time Order Management**: View and manage kitchen orders with live updates
- **Order Status Tracking**: Track orders through Pending → Received → Completed states
- **RabbitMQ Integration**: Receive new orders and send status updates via message queues
- **Responsive UI**: Modern, clean interface with smooth animations
- **Auto-refresh**: Orders update automatically every 2 seconds
- **Order Processing**: Process and complete orders with one-click buttons

## 🛠️ Tech Stack

### Frontend
- **SvelteKit** - Modern web framework
- **TypeScript** - Type-safe JavaScript

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript

### Message Queue
- **RabbitMQ** - Message broker for order processing

## 🏗️ Architecture

### Frontend (Svelte + TypeScript)
- **Framework**: SvelteKit with TypeScript
- **Features**: Auto-polling, smooth transitions, responsive layout
- **Port**: 5173 (development)

### Backend (Node.js + Express)
- **Framework**: Express.js with TypeScript
- **Message Queue**: RabbitMQ integration with amqplib
- **Features**: REST API, order management, real-time updates
- **Port**: 3001

### Message Queues
- **Incoming Orders**: `orders` queue - receives new orders
- **Status Updates**: `orderStatus` queue - sends order status changes