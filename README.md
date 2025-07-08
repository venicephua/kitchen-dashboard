# Kitchen Dashboard 🍽️

A real-time kitchen order management system built with SvelteKit frontend and NestJS backend, featuring PostgreSQL database and RabbitMQ integration for order processing. Part 2 of a two-part application for an Ordering and Order Management system. 

View Part 1 [here](https://github.com/shanicetanhui/ordering-app).

## 🚀 Features

- **Real-time Order Management**: View and manage kitchen orders with live updates via Server-Sent Events (SSE)
- **Order Status Tracking**: Track orders through Pending → Received → Completed states
- **RabbitMQ Integration**: Receive new orders and send status updates via message queues
- **Persistent Storage**: Orders stored in PostgreSQL database with full data persistence
- **Server-Side Rendering**: Fast initial page loads with SvelteKit SSR
- **Responsive UI**: Modern, clean interface with smooth animations
- **Server-Sent Events**: Real-time updates without polling - instant order notifications
- **Order Processing**: Process and complete orders with one-click buttons
- **Order Visibility**: Hide completed orders from view while keeping them in database
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
- **Features**: Server-Sent Events (SSE), smooth transitions, responsive layout, real-time updates
- **Port**: 3001
- **API Integration**: Direct HTTP calls to NestJS backend with proxy support
- **Real-time**: EventSource API for instant order updates via SSE

### Backend (NestJS + TypeScript)
- **Framework**: NestJS with TypeScript decorators and dependency injection
- **Database**: PostgreSQL with TypeORM for entity management
- **Message Queue**: RabbitMQ integration with amqplib
- **Features**: REST API, Server-Sent Events, order management, real-time updates, data persistence
- **Architecture**: Modular design with controllers, services, entities, and modules
- **Port**: 3000
- **SSE**: RxJS-based event streaming for real-time client updates

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

### pgAdmin Web Interface

pgAdmin is included for easy database management through a web interface:

1. **Access pgAdmin**: Navigate to http://localhost:5050
2. **Login**: Use `admin@kitchen.com` / `admin123`
3. **Add Server**: Right-click "Servers" → "Register" → "Server"
4. **Server Configuration**:
   - **Name**: Kitchen Database
   - **Connection Tab**:
     - **Host**: `postgres` (Docker service name)
     - **Port**: `5432`
     - **Database**: `kitchen_db`
     - **Username**: `kitchen_user`
     - **Password**: `kitchen_pass`

### Database Schema
```sql
-- Orders table structure
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  items JSONB NOT NULL,  -- {"name": "Coffee", "quantity": 2}
  status orders_status_enum DEFAULT 'Pending',  -- Pending/Received/Completed
  "isVisible" BOOLEAN DEFAULT true,  -- Controls order visibility
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
pgAdmin:          http://localhost:5050 (admin@kitchen.com/admin123)
```

## 📡 API Endpoints

### Orders API
```bash
# Get all orders
GET http://localhost:3000/api/orders

# Server-Sent Events stream for real-time updates
GET http://localhost:3000/api/orders/stream
Accept: text/event-stream

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
PATCH http://localhost:3000/api/orders/123
Content-Type: application/json
{
  "status": "Completed"
}

# Hide order from view
PATCH http://localhost:3000/api/orders/123/hide
```

## 🔄 Real-time Updates with Server-Sent Events

The application uses Server-Sent Events (SSE) for real-time order updates, replacing traditional polling for better performance and instant notifications.

### How SSE Works

1. **Frontend connects**: `EventSource` connects to `/api/orders/stream`
2. **Backend streams**: NestJS `@Sse` decorator with RxJS Observable
3. **Real-time updates**: Order changes broadcast instantly to all connected clients

### SSE Event Types
```json
// Connection established
{ "type": "connected" }

// New order created
{ "type": "order_created", "order": { "id": 1, "items": {...}, "status": "Pending" } }

// Order status updated
{ "type": "order_updated", "order": { "id": 1, "items": {...}, "status": "Completed" } }

// Order hidden from view
{ "type": "order_hidden", "order": { "id": 1, ... } }
```

## 🛠️ Development

### Project Structure
```
kitchen-dashboard/
├── docker-compose.yml          # Multi-container orchestration
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules (excludes .env)
├── frontend/                  # SvelteKit application
│   ├── src/
│   │   ├── lib/
│   │   │   ├── api.ts         # API client functions
│   │   │   ├── OrderList.svelte
│   │   │   └── stores/
│   │   │       └── orders.ts  # Svelte stores for state management
│   │   ├── routes/
│   │   │   ├── +page.svelte   # Main dashboard (pending orders)
│   │   │   ├── +layout.server.ts # SSR data loading
│   │   │   └── completed/
│   │   │       └── +page.svelte # Completed orders page
│   │   └── hooks.server.ts    # SSR API proxy
│   └── Dockerfile
└── nestjs-backend/            # NestJS application
    ├── src/
    │   ├── entities/
    │   │   └── order.entity.ts    # Database models
    │   ├── orders/
    │   │   ├── orders.controller.ts # API endpoints + SSE stream
    │   │   ├── order-creation.service.ts   # Order creation logic
    │   │   ├── order-retrieval.service.ts  # Order fetching logic
    │   │   ├── order-update.service.ts     # Order status updates
    │   │   ├── order-stream.service.ts     # SSE event streaming
    │   │   ├── order-visibility.service.ts # Order hiding logic
    │   │   └── orders.module.ts     # NestJS module
    │   ├── rabbitmq/
    │   │   └── rabbitmq.service.ts  # Message queue
    │   ├── app.module.ts           # Root module
    │   └── main.ts                 # Application entry
    └── Dockerfile
```

### Environment Variables
```bash
# Create .env file from template
cp .env.example .env

# Edit .env with your configuration
# Note: .env is gitignored for security

# Backend environment variables
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=kitchen_user
DB_PASSWORD=kitchen_pass
DB_NAME=kitchen_db
RABBITMQ_URL=amqp://localhost:5672
NODE_ENV=development
BACKEND_PORT=3000
FRONTEND_PORT=3001
```

## 🧪 Testing

### Manual Testing
```bash
# Test order creation via API
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items": {"name": "Test Coffee", "quantity": 1}}'

# Test order status update
curl -X PATCH http://localhost:3000/api/orders/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "Completed"}'

# Test order hiding
curl -X PATCH http://localhost:3000/api/orders/1/hide

# Test SSE stream (in separate terminal)
curl -N -H "Accept: text/event-stream" http://localhost:3000/api/orders/stream

# Test via RabbitMQ (send message to orders queue)
# Use RabbitMQ Management UI at http://localhost:15672
```

### Database Testing
```bash
# Check order count
docker exec kitchen-postgres psql -U kitchen_user -d kitchen_db -c "SELECT COUNT(*) FROM orders;"

# View recent orders
docker exec kitchen-postgres psql -U kitchen_user -d kitchen_db -c "SELECT * FROM orders ORDER BY \"createdAt\" DESC LIMIT 5;"

# Check order visibility
docker exec kitchen-postgres psql -U kitchen_user -d kitchen_db -c "SELECT id, items->>'name' as name, status, \"isVisible\" FROM orders;"
```

### pgAdmin Testing
```bash
# Access pgAdmin for visual database management
# 1. Open http://localhost:5050
# 2. Login with admin@kitchen.com / admin123
# 3. Connect to Kitchen Database server
# 4. Navigate to: Servers → Kitchen Database → Databases → kitchen_db → Schemas → public → Tables → orders
# 5. Right-click orders table → "View/Edit Data" → "All Rows"
```

## 🔧 Troubleshooting

### Common Issues

**Database Connection Issues:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# View database logs
docker logs kitchen-postgres

# Check pgAdmin logs
docker logs kitchen-pgadmin

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
netstat -tulpn | grep -E "(3000|3001|5432|5672|15672|5050)"

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
- [x] Real-time order management with Server-Sent Events (SSE)
- [x] PostgreSQL data persistence  
- [x] RabbitMQ message processing
- [x] Server-side rendering (SSR)
- [x] Docker containerization
- [x] TypeScript throughout
- [x] Real-time updates without polling
- [x] Order visibility management (hide/show)
- [x] Separated page views (pending vs completed orders)
- [x] Environment variable configuration with `.env.example`
- [x] Modular NestJS architecture with service separation
- [x] Svelte stores for state management

### 🔄 Future Enhancements
- [ ] User authentication
- [ ] Order history and analytics
- [ ] Push notifications
- [ ] Multi-restaurant support
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