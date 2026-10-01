# Task Management System

## Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
Create PostgreSQL database `task_manager` first.

## Frontend
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```
Open http://localhost:3000.

## API
POST /api/auth/signup
POST /api/auth/login
GET /api/auth/me
POST /api/tasks
GET /api/tasks?status=todo&priority=high&search=test
GET /api/tasks/:id
PUT /api/tasks/:id
DELETE /api/tasks/:id

JWT is sent as `Authorization: Bearer <accessToken>`.

For production, replace TypeORM `synchronize: true` with migrations.
