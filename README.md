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
- **Port**: 3001

### Backend (Node.js + Express)
- **Framework**: Express.js with TypeScript
- **Message Queue**: RabbitMQ integration with amqplib
- **Features**: REST API, order management, real-time updates
- **Port**: 3000

## 🚀 Quick Start

### Option 1: Docker (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd kitchen-dashboard

# Start all services with Docker Compose
docker-compose up --build
```

### Option 2: Manual Setup
```bash
# Clone the repository
git clone <repository-url>
cd kitchen-dashboard

# Start frontend (runs on port 3001)
cd frontend
npm install
npm run dev

# Start backend (runs on port 3000)
cd ../backend
npm install
npm start
```

## 🔗 RabbitMQ Configuration

This application requires a RabbitMQ server to handle order messaging. 

### External RabbitMQ Server (Current Set Up)
Have RabbitMQ running on another machine (e.g., another laptop):

```bash
# Set the RabbitMQ connection URL
set RABBITMQ_URL=amqp://username:password@your-rabbitmq-host:5672

# Then start the application
docker-compose up
```

## 🌐 Access Points

```bash
# Application URLs
Frontend:    http://localhost:3001
Backend API: http://localhost:3000
RabbitMQ UI: http://your-rabbitmq-host:15672 (default: guest/guest)
```


### Message Queues
- **Incoming Orders**: `orders` queue - receives new orders
- **Status Updates**: `orderStatus` queue - sends order status changes