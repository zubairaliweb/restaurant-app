# Saffron & Smoke — Restaurant Management & Online Food Ordering (MERN Stack)

A full-stack restaurant website: browsing menu, cart, checkout, table reservations, a customer
dashboard, and a full admin panel for managing food, orders, reservations, and users.

**Stack:** MongoDB · Express.js · React 19 (Vite) · Node.js · Tailwind CSS v4 · JWT Auth

```
restaurant-app/
├── backend/     Express + MongoDB REST API
└── frontend/    React 19 + Tailwind v4 (Vite)
```

---

## 1. Prerequisites

- Node.js 18+ and npm 12+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) **or** a free MongoDB Atlas cluster

---

## 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set your values:

```
MONGO_URI=mongodb://127.0.0.1:27017/restaurant_db
PORT=5000
JWT_SECRET=replace_this_with_a_long_random_secret_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Seed the database with sample categories, menu items, and an admin account:

```bash
npm run seed
```

This creates an admin login:

- **Email:** `admin@restaurant.com`
- **Password:** `Admin@123`

Start the backend:

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start        # plain node
```

The API runs at `http://localhost:5000/api` (health check: `GET /api/health`).

---

## 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

`.env` should point at your backend:

```
VITE_API_URL=http://localhost:5000/api
```

Run the dev server:

```bash
npm run dev
```

Visit `http://localhost:5173`.

---

## 4. Building for Production

```bash
cd frontend
npm run build       # outputs static files to frontend/dist
npm run preview     # preview the production build locally
```

Deploy `frontend/dist` to any static host (Vercel, Netlify, Nginx, etc.), and set
`VITE_API_URL` to your deployed backend's URL before building.

For the backend, deploy the `backend/` folder to any Node host (Render, Railway, a VPS with PM2,
etc.), set the environment variables from `.env.example` in that host's dashboard, and point
`CLIENT_URL` at your deployed frontend's URL.

---

## 5. Feature Overview

**Public:** Home, full menu with search/category filters, food details, cart, register/login,
table reservation form.

**Authenticated users:** Checkout (Cash on Delivery or Online Payment), dashboard with profile
editing, order history with live status, and reservation history.

**Admin (`role: admin`):** Dashboard stats (orders, revenue, customers, food items, pending
orders, recent orders), full CRUD on food items and categories, order management with status
updates, reservation approval/cancellation, and user management.

Order status flow: `Pending → Confirmed → Preparing → Out for Delivery → Delivered` (or `Cancelled`).

---

## 6. API Reference

All endpoints are prefixed with `/api`.

| Method | Endpoint                     | Access        | Description                  |
|--------|-------------------------------|---------------|-------------------------------|
| POST   | `/auth/register`              | Public        | Register a new user          |
| POST   | `/auth/login`                 | Public        | Log in, returns JWT          |
| GET    | `/auth/profile`               | Private       | Get current user profile     |
| PUT    | `/auth/profile`               | Private       | Update profile               |
| GET    | `/foods?search=&category=`    | Public        | List/search/filter foods     |
| GET    | `/foods/:id`                  | Public        | Get single food item         |
| POST   | `/foods`                      | Admin         | Create food item              |
| PUT    | `/foods/:id`                  | Admin         | Update food item              |
| DELETE | `/foods/:id`                  | Admin         | Delete food item              |
| GET    | `/categories`                 | Public        | List categories               |
| POST   | `/categories`                 | Admin         | Create category               |
| PUT    | `/categories/:id`             | Admin         | Update category               |
| DELETE | `/categories/:id`             | Admin         | Delete category               |
| POST   | `/orders`                     | Private       | Place an order                |
| GET    | `/orders/my`                  | Private       | Current user's orders         |
| GET    | `/orders/:id`                 | Private       | Get one order (owner/admin)   |
| GET    | `/orders`                     | Admin         | List all orders               |
| PUT    | `/orders/:id/status`          | Admin         | Update order status           |
| POST   | `/reservations`               | Private       | Book a table                  |
| GET    | `/reservations/my`            | Private       | Current user's reservations   |
| GET    | `/reservations`               | Admin         | List all reservations         |
| PUT    | `/reservations/:id/status`    | Admin         | Approve/cancel reservation    |
| GET    | `/users`                      | Admin         | List all users                |
| DELETE | `/users/:id`                  | Admin         | Delete a user                 |
| GET    | `/admin/stats`                | Admin         | Dashboard statistics          |

Authenticated requests send `Authorization: Bearer <token>`.

---

## 7. Notes & Next Steps

- Food images are stored as URLs in this build (see the seed data for examples on Unsplash).
  To support real file uploads, wire up the already-installed `multer` package to a new
  `POST /api/foods/upload` route and swap the admin form's image field for a file input.
- "Online Payment" is captured as a selectable option on checkout but isn't wired to a real
  payment gateway — plug in Stripe, PayFast, or JazzCash/Easypaisa for production use.
- Passwords are hashed with bcrypt and JWTs expire after `JWT_EXPIRES_IN` (default 7 days).
- Run `npm run seed` again any time to reset menu/category data (it clears foods & categories
  first, but leaves existing user accounts and orders untouched).
