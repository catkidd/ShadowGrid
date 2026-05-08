# ShadowGrid

> A premium, industrial-styled boutique for high-end computer peripherals.

## Table of Contents
- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack (The "Brain" and "Body")](#tech-stack-the-brain-and-body)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage (How to Run)](#usage-how-to-run)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## About the Project

ShadowGrid is a high-performance e-commerce store designed for peripheral enthusiasts. Whether you are looking for mechanical keyboards with optical switches, high-refresh studio monitors, or precision mice, ShadowGrid provides a sleek, "Industrial" shopping experience.

For non-technical readers: Think of this as a complete website package that includes both the storefront you see and the storage room (database) where products are kept.

## Key Features

- **Industrial Aesthetic**: A minimalist dark theme using Deep Charcoal and Neon Cyan.
- **Stock Validator**: A smart system that prevents you from adding more items to your cart than are actually available in the shop.
- **Persistent Cart**: Your shopping cart stays saved even if you refresh the page or close your browser.
- **Responsive Design**: Works perfectly on mobile phones, tablets, and desktop computers.
- **Mock Data Fallback**: The app is smart enough to show sample products even if the main database isn't connected yet.

## Tech Stack (The "Brain" and "Body")

To build this, we used modern tools that professional engineers use:

- **Frontend (The Body)**: Built with **React** and **Tailwind CSS 4**. This is the part you see and interact with.
- **Backend (The Brain)**: Built with **Node.js** and **Express**. This handles the logic, like checking if a product is in stock.
- **Database (The Storage)**: Powered by **MongoDB**. This is where all product names, prices, and images are safely stored.

## Prerequisites

To run ShadowGrid on your local computer, you need:

- **Node.js**: Version `20.x` or higher. [Download here](https://nodejs.org/).
- **MongoDB**: (Optional but recommended) Version `6.x` or higher. The app includes a "Mock Mode" if you don't have MongoDB installed.
- **Git**: To copy the project files.

## Installation

Follow these steps in order. Copy and paste these commands into your terminal (Command Prompt or PowerShell):

### 1. Copy the Project
```bash
git clone <your-repository-url>
cd ShadowGrid
```

### 2. Set up the "Brain" (Server)
```bash
cd server
npm install
```

### 3. Set up the "Body" (Client)
```bash
cd ../client
npm install
```

---

## Usage (How to Run)

To see the website in action, you need to start two separate "engines":

### Step 1: Start the Server
Open a terminal in the `server` folder and run:
```bash
npm run dev
```
> **Note:** The server will run at `http://localhost:5000`. It will automatically use "Mock Data" if it can't find a MongoDB database.

### Step 2: Start the Website
Open a **new** terminal window in the `client` folder and run:
```bash
npm run dev
```
> **Note:** The website will open at `http://localhost:5173` (or similar). Click the link in your terminal to view it.

---

---

## Admin System Guide

The ShadowGrid Admin System allows you to manage products directly from the website.

### 1. Create an Admin Account
1. Go to the **Sign Up** page.
2. Register a new account with your email.
3. By default, new users have the `user` role. To become an **Admin**, you must manually update your record in the database:
   - If using MongoDB Compass or Shell:
     ```javascript
     db.users.updateOne({ email: "your-email@example.com" }, { $set: { role: "admin" } });
     ```
4. **Login** with your updated account.

### 2. Access the Admin Dashboard
Once logged in as an Admin, a new **"Admin"** link will appear in the top navigation bar. Click it to enter the **Admin Dashboard**.

### 3. Managing Products
- **Add Product**: Click the **"Add New Product"** button at the top right. Fill in the product details and click **"Save Product"**.
- **Edit Product**: Click the **Edit** icon (pencil) on any product card. Update the information and save.
- **Delete Product**: Click the **Delete** icon (trash can) on any product card. Confirm the decommissioning protocol to remove it from the grid.

> [!IMPORTANT]
> Administrative actions (Add, Edit, Delete) are protected. Even if someone finds the dashboard URL, the server will reject any changes without a valid Admin token.

---

## Troubleshooting

- **"Connection error. Grid access unavailable."**: 
  - **Check API Connection**: Open your browser console (F12). Look for the log "Attempting login connection to: ...". Ensure it says `http://localhost:5000` when working locally.
  - **Check Backend Status**: Ensure your server is running (`cd server && npm run dev`). If the server terminal shows a MongoDB error, follow the "Database Issue" steps below.
  - **Database Issue?**: If your MongoDB connection is failing (e.g., Atlas is blocked), you have two options:
    1. **Emergency Admin**: Use the credentials below. I have added a fallback in `server.js` that allows these to work even without a database.
       - **Email**: `admin@shadowgrid.com`
       - **Password**: `admin_password_2026`
    2. **Local MongoDB**: Install MongoDB locally and change `MONGODB_URI` in `server/.env` to `mongodb://localhost:27017/shadowgrid`.
  - **Atlas Whitelist**: If you are using MongoDB Atlas, make sure your current IP address is added to the **Network Access** whitelist in the Atlas dashboard.
- **"MongoDB Connection Error"**: Don't worry! This is normal if you haven't installed MongoDB. The app will automatically switch to "Mock Mode" for products.
- **"Port in use"**: If you see this, Vite will usually pick a new one (like `5174`) automatically.

## New Features

- **Password Toggle**: You can now click the eye icon in the password field to show or hide your password during login and signup.

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

> **Design Note:** We chose Tailwind CSS 4 for this project to leverage its high-performance CSS-in-JS engine, allowing us to create complex "Glassmorphism" effects without bulky custom code.
