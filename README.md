#  Ecommerce-Remote Microservices System

This repository contains a scalable eCommerce platform built using a **microservices architecture** powered by **NestJS**, **RabbitMQ**, **PostgreSQL**, and a frontend built with **Next.js**.
## 📦 Tech Stack
- **Backend:** NestJS, PostgreSQL, Sequelize, RabbitMQ (for inter-service communication)
- **Frontend:** Next.js, TypeScript, Redux Toolkit, RTK Query, Material UI
- Docker

## 🚀 Getting Started
### ✅ Prerequisites

- Node.js (v18+)
- PostgreSQL
- RabbitMQ
- Git

### 🛠 Installation

#### 1. Clone the Repository

git clone https://github.com/sumitrajput9/Ecommerce-Remote.git
cd Ecommerce-Remote
2. Setup Environment Variables
Create a .env file in each backend service (customer-service-backend/, product-order-service-backend/) with:
env
Copy
Edit
# .env (example)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_pg_username
DB_PASSWORD=your_pg_password
DB_DATABASE=your_database_name
RABBITMQ_URI=amqp://localhost:5672  also you can directly config file change the .env i alredy added pls replace it
⚠️ Set values as per your system.
🧱 Run Microservices
1. Customer Service
cd customer-service-backend
npm install
npm run start:dev
2. Product & Order Service
cd product-order-service-backend
npm install
npm run start:dev
Make sure RabbitMQ and PostgreSQL are running locally.

🌐 Run Frontend (Next.js)
cd Ecommerce-Frontend/ecommerce-frontend
npm install
npm run dev
Access: http://localhost:3002
📬 Microservices Communication
All services communicate through RabbitMQ queues using @nestjs/microservices message patterns.
Customer → Orders (on purchase)
Product → 
Shared response structure via DTOs
✨ Features
👤 Customer Management (Profile)
📦 Product Listing & Inventory
🧾 Orders
🔒 Auth (planned via microservice auth gateway)
🖼 Image Upload with Firebase (for career module)
📚 Modular & Scalable Architecture
🔧 Scripts (Sample)
# Start Microservices
npm run start:dev
# Lint
npm run lint
# Build
npm run build
