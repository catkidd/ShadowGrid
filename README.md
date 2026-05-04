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

## Troubleshooting

- **"MongoDB Connection Error"**: Don't worry! This is normal if you haven't installed MongoDB. The app will automatically switch to "Mock Mode" so you can still see the products.
- **"Port in use"**: If you see this, it means another app is using the same slot. Vite will usually pick a new one (like `5174`) automatically.
- **Styling looks broken**: Ensure you are running the project in a modern browser like Chrome, Edge, or Brave.

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

> **Design Note:** We chose Tailwind CSS 4 for this project to leverage its high-performance CSS-in-JS engine, allowing us to create complex "Glassmorphism" effects without bulky custom code.
