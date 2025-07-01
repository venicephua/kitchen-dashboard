# Kitchen Dashboard 🍽️

A real-time kitchen order management system built with SvelteKit frontend and NestJS backend, featuring PostgreSQL database and RabbitMQ integration for order processing. Part 2 of a two-part application for an Ordering and Order Management system. 

View Part 1 [here](https://github.com/shanicetanhui/ordering-app).

## 🚀 Features

- **Real-time Order Management**: View and manage kitchen orders with live updates
- **Order Status Tracking**: Track orders through Pending → Received → Completed states
- **RabbitMQ Integration**: Receive new orders and send status updates via message queues
- **Persistent Storage**: Orders stored in PostgreSQL database with full data persistence
- **Server-Side Rendering**: Fast initial page loads with SvelteKit SSR
- **Responsive UI**: Modern, clean interface with smooth animations
- **Auto-refresh**: Orders update automatically every 2 seconds
- **Order Processing**: Process and complete orders with one-click buttons
- **Type Safety**: Full TypeScript implementation across frontend and backend
- **Docker Support**: Complete containerized deployment with Docker Compose

## 🛠️ Tech Stack

### Frontend
- **SvelteKit** - Modern web framework with SSR
- **TypeScript** - Type-safe JavaScript

### Backend
- **Node.js** - JavaScript runtime
- **NestJS** - Enterprise-grade Node.js framework
- **TypeORM** - TypeScript ORM for database operations
- **TypeScript** - Type-safe JavaScript

### Database
- **PostgreSQL** - Robust relational database
- **Docker** - Containerized database deployment

### Message Queue
- **RabbitMQ** - Message broker for order processing
- **Docker** - Containerized message broker

### DevOps
- **Docker** - Container platform
- **Docker Compose** - Multi-container orchestration

## 🏗️ Architecture

### Frontend (SvelteKit + TypeScript)
- **Framework**: SvelteKit with Server-Side Rendering (SSR)
- **Features**: Auto-polling, smooth transitions, responsive layout, optimistic UI updates
- **Port**: 3001
- **API Integration**: Direct HTTP calls to NestJS backend with proxy support

### Backend (NestJS + TypeScript)
- **Framework**: NestJS with TypeScript decorators and dependency injection
- **Database**: PostgreSQL with TypeORM for entity management
- **Message Queue**: RabbitMQ integration with amqplib
- **Features**: REST API, order management, real-time updates, data persistence
- **Architecture**: Modular design with controllers, services, entities, and modules
- **Port**: 3000

### Database (PostgreSQL)
- **Engine**: PostgreSQL 15 with Alpine Linux
- **ORM**: TypeORM with entity-based models
- **Features**: JSONB support for complex order data, auto-generated migrations
- **Persistence**: Docker volume for data persistence
- **Port**: 5432

### Message Queue (RabbitMQ)
- **Broker**: RabbitMQ with management interface
- **Queues**: `orders` (incoming), `orderStatus` (outgoing)
- **Features**: Message acknowledgment, error handling, connection resilience
- **Ports**: 5672 (AMQP), 15672 (Management UI)

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd kitchen-dashboard

# Start all services (PostgreSQL, RabbitMQ, NestJS backend, SvelteKit frontend)
docker-compose up -d --build

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### Option 2: Development Mode
```bash
# Prerequisites: PostgreSQL and RabbitMQ running locally

# Clone the repository
git clone <repository-url>
cd kitchen-dashboard

# Start NestJS backend (runs on port 3000)
cd nestjs-backend
npm install
npm run start:dev

# Start SvelteKit frontend (runs on port 3001)
cd ../frontend
npm install
npm run dev
```

## 🗄️ Database Management

### Quick Commands
```bash
# Connect to database
docker exec -it kitchen-postgres psql -U kitchen_user -d kitchen_db

# View all orders
docker exec kitchen-postgres psql -U kitchen_user -d kitchen_db -c "SELECT * FROM orders;"

# Clear all data and reset ID sequence
docker exec kitchen-postgres psql -U kitchen_user -d kitchen_db -c "DELETE FROM orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;"

# Backup database
docker exec kitchen-postgres pg_dump -U kitchen_user kitchen_db > backup.sql
```

### Database Schema
```sql
-- Orders table structure
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  items JSONB NOT NULL,  -- {"name": "Coffee", "quantity": 2}
  status orders_status_enum DEFAULT 'Pending',  -- Pending/Received/Completed
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);
```

## 🔗 RabbitMQ Configuration

### Docker Deployment (Included)
RabbitMQ is automatically started with Docker Compose:
```bash
# RabbitMQ is included in docker-compose.yml
docker-compose up -d
```

### External RabbitMQ Server
To connect to an external RabbitMQ server:
```bash
# Set environment variable
export RABBITMQ_URL=amqp://username:password@your-rabbitmq-host:5672

# Or update docker-compose.yml environment section
RABBITMQ_URL: amqp://username:password@your-rabbitmq-host:5672
```

### Message Format
```json
// Incoming orders (to 'orders' queue)
{
  "name": "Cappuccino",
  "quantity": 2
}

// Or new format
{
  "items": {
    "name": "Cappuccino", 
    "quantity": 2
  }
}

// Outgoing status updates (to 'orderStatus' queue)
{
  "orderId": 123,
  "status": "Completed"
}
```

## 🌐 Access Points

```bash
# Application URLs
Frontend:         http://localhost:3001
Backend API:      http://localhost:3000
Database:         localhost:5432 (kitchen_user/kitchen_pass)
RabbitMQ AMQP:    localhost:5672
RabbitMQ Web UI:  http://localhost:15672 (guest/guest)
```

## 📡 API Endpoints

### Orders API
```bash
# Get all orders
GET http://localhost:3000/api/orders

# Create new order
POST http://localhost:3000/api/orders
Content-Type: application/json
{
  "items": {
    "name": "Latte",
    "quantity": 1
  }
}

# Update order status
PATCH http://localhost:3000/api/orders/123/update
Content-Type: application/json
{
  "status": "Completed"
}
```

## 🛠️ Development

### Project Structure
```
kitchen-dashboard/
├── docker-compose.yml          # Multi-container orchestration
├── frontend/                   # SvelteKit application
│   ├── src/
│   │   ├── lib/
│   │   │   ├── api.ts         # API client functions
│   │   │   └── OrderList.svelte
│   │   ├── routes/
│   │   │   └── +page.svelte   # Main dashboard
│   │   └── hooks.server.ts    # SSR API proxy
│   └── Dockerfile
└── nestjs-backend/            # NestJS application
    ├── src/
    │   ├── entities/
    │   │   └── order.entity.ts    # Database models
    │   ├── orders/
    │   │   ├── orders.controller.ts # API endpoints
    │   │   ├── orders.service.ts    # Business logic
    │   │   └── orders.module.ts     # NestJS module
    │   ├── rabbitmq/
    │   │   └── rabbitmq.service.ts  # Message queue
    │   ├── app.module.ts           # Root module
    │   └── main.ts                 # Application entry
    └── Dockerfile
```

### Environment Variables
```bash
# Backend (.env)
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=kitchen_user
DB_PASSWORD=kitchen_pass
DB_NAME=kitchen_db
RABBITMQ_URL=amqp://rabbitmq:5672
```

## 🧪 Testing

### Manual Testing
```bash
# Test order creation via API
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items": {"name": "Test Coffee", "quantity": 1}}'

# Test via RabbitMQ (send message to orders queue)
# Use RabbitMQ Management UI at http://localhost:15672
```

### Database Testing
```bash
# Check order count
docker exec kitchen-postgres psql -U kitchen_user -d kitchen_db -c "SELECT COUNT(*) FROM orders;"

# View recent orders
docker exec kitchen-postgres psql -U kitchen_user -d kitchen_db -c "SELECT * FROM orders ORDER BY \"createdAt\" DESC LIMIT 5;"
```

## 🔧 Troubleshooting

### Common Issues

**Database Connection Issues:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# View database logs
docker logs kitchen-postgres

# Reset database (nuclear option)
docker-compose down -v && docker-compose up -d
```

**RabbitMQ Connection Issues:**
```bash
# Check RabbitMQ status
docker logs kitchen-rabbitmq

# Verify queues exist
# Visit http://localhost:15672 and check Queues tab
```

**Frontend/Backend Communication:**
```bash
# Check if backend is responding
curl http://localhost:3000/api/orders

# Check backend logs
docker logs kitchen-nestjs-backend

# Check frontend logs
docker logs kitchen-frontend
```

### Port Conflicts
```bash
# Check what's using ports
netstat -tulpn | grep -E "(3000|3001|5432|5672|15672)"

# Stop conflicting services
docker-compose down
```

## 🚀 Deployment

### Production Deployment
```bash
# Build for production
docker-compose -f docker-compose.prod.yml up -d --build

# Or build individual services
docker build -t kitchen-frontend ./frontend
docker build -t kitchen-backend ./nestjs-backend
```

### Environment Configuration
```yaml
# docker-compose.prod.yml example
environment:
  - NODE_ENV=production
  - DB_HOST=your-production-db
  - RABBITMQ_URL=amqp://your-production-rabbitmq
```

## 📋 Features

### ✅ Implemented
- [x] Real-time order management
- [x] PostgreSQL data persistence  
- [x] RabbitMQ message processing
- [x] Server-side rendering (SSR)
- [x] Docker containerization
- [x] TypeScript throughout
- [x] Optimistic UI updates
- [x] Auto-refresh functionality

### 🔄 Future Enhancements
- [ ] User authentication
- [ ] Order history and analytics
- [ ] Push notifications
- [ ] Multi-restaurant support
- [ ] Real-time WebSocket updates
- [ ] Order filtering and search
- [ ] Performance monitoring
- [ ] Automated testing suite

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Happy cooking! 👨‍🍳👩‍🍳**