# JavaShipped – Coffee Order Manager (MERN)

A full-stack coffee delivery app. Customers browse drinks and place orders. Kitchen staff see every order and move it from **Received → Being Prepared → Delivered**.

Stack: **MongoDB** (in Docker) · **Express + Mongoose** · **React** (functional components, hooks, React Router) · **Vite**

---

## Abstract

JavaShipped is a small web application for an online coffee delivery company. It has two sides. Customers can see the drinks menu, place an order, and track it by mobile number. The kitchen can view all orders and update each one until it is delivered. Stock is checked and reduced at the moment an order is placed, and customers can cancel an order only while the kitchen has not started on it. An analytics dashboard summarises total orders, sales and the share of each drink.

## Introduction

Many small coffee shops take orders by phone or chat, which makes it hard to keep track of stock and order progress. This project replaces that with a single system backed by a database. The project covers the core parts of a MERN application: a React frontend with routing and forms, a REST API, and a MongoDB database with CRUD operations.

## Frontend Components

| Page / component | Route | What it does |
|---|---|---|
| `Landing` | `/` | Company name, large banner, short description, and three feature sections (Our Drinks, Track Your Order, Live Analytics). |
| `Menu` + `DrinkCard` | `/menu` | Shows all drinks with image, description, price and an **Order Now** button. Shows "Out of stock" when stock is 0. |
| `OrderForm` | `/order/:drinkId` | Form for name, mobile, drink, size, quantity and delivery address. Shows the total (price × quantity). On success shows the Order ID and status "Received". Shows "Out of stock" if needed. |
| `OrderStatus` | `/status` | Lists a customer's orders by mobile number. Refreshes every 5 seconds with `useEffect`. Each status has its own colour. Customers can cancel while status is Received. |
| `Kitchen` (admin) | `/kitchen` | Lists all orders. Buttons move each order to the next status. |
| `Analytics` | `/analytics` | Total orders, total sales, and orders and percentage for each drink. |
| `StatusBadge` | — | Coloured label for a status (reused on status and kitchen pages). |

React features used: functional components, JSX, props (`DrinkCard`, `StatusBadge`), `useState`, `useEffect` (data loading and 5-second refresh), controlled forms, conditional rendering, and React Router (`BrowserRouter`, `Routes`, `Route`, `NavLink`, `useParams`).

## Database

Database name: **coffeeDB** (MongoDB, running in Docker).

| Collection | Main fields |
|---|---|
| `drinks` | `name`, `description`, `price`, `image`, `stock` |
| `customers` | `name`, `mobile` (unique), `address` |
| `orders` | `customer`, `customerName`, `mobile`, `drink`, `drinkName`, `size`, `quantity`, `unitPrice`, `totalAmount`, `deliveryAddress`, `status`, timestamps |

Order rules:
- **Place order:** stock is reduced in a single step, only if enough is left. If stock is 0 the server replies "Out of stock". The order is saved with status `Received`.
- **Status:** can only move forward, one step at a time.
- **Cancel:** deletes the order and gives its quantity back to the drink's stock. Works only while status is `Received`.

`mongo/seed.js` runs the CRUD demo in mongosh: it creates drinks, a customer and an order; reads them; updates stock and status; and tries a delete that is blocked after the order has moved on.

## Screenshots

Add screenshots of each page here before submitting (landing, menu, order form, order status, kitchen, analytics).

## How to run

You need: Docker Desktop, Node.js 20+, and mongosh (install from mongodb.com/try/download/shell).

1. **Start MongoDB**
   ```
   docker compose up -d
   ```
2. **Load the drinks and run the CRUD demo**
   ```
   mongosh "mongodb://localhost:27017/coffeeDB" mongo/seed.js
   ```
3. **Start the API** (in one terminal)
   ```
   cd server
   cp .env.example .env
   npm install
   npm run dev
   ```
4. **Start the React app** (in a second terminal)
   ```
   cd client
   npm install
   npm run dev
   ```
5. Open **http://localhost:5173**.

## Conclusion

The project shows a complete MERN flow: the React frontend talks to an Express API, which saves and reads data in MongoDB. Stock control, status tracking and cancellation follow the rules in the brief. The app is kept small on purpose, so the code stays easy to read and explain.
