# ShadowGrid

> High-performance, industrial-grade e-commerce architecture for the digital elite.

ShadowGrid is a premium boutique storefront specializing in high-end computer peripherals. Built with an industrial aesthetic and a focus on precision, the platform provides a seamless, secure, and highly responsive shopping experience for enthusiasts.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Security & Performance](#security--performance)
- [Admin Guide](#admin-guide)
- [License](#license)

## Prerequisites
To deploy or run the ShadowGrid platform, the following environment requirements must be met:

- **Node.js**: `v20.x` or higher
- **MongoDB**: `v6.x` or higher (Active instance required; mock fallbacks have been deprecated for production stability)
- **Git**: Latest stable version

## Installation
Clone the repository and install the necessary dependencies for both the API server and the frontend client.

```bash
# 1. Clone the repository
git clone <repository-url>
cd ShadowGrid

# 2. Configure the API Server
cd server
npm install

# 3. Configure the Client
cd ../client
npm install
```

## Usage
The application requires the concurrent execution of the backend services and the frontend interface.

### 1. API Server Initialization
From the `server` directory:
```bash
npm run dev
```
> **Design Note:** The server establishes a mandatory connection to MongoDB on startup. Environment variables should be configured in a `.env` file within the `server` directory (see `.env.example`).

### 2. Client Development Server
From the `client` directory:
```bash
npm run dev
```
The application will be served at `http://localhost:5173`.

## Key Features
- **Industrial Aesthetic**: A minimalist, high-contrast dark theme utilizing Deep Charcoal and Neon Cyan accents.
- **Real-time Inventory**: Synchronized stock validation prevents over-allocation of inventory during the checkout flow.
- **Persistent Cart Architecture**: Client-side state persistence ensures cart data survives session refreshes.
- **Review System**: Integrated user feedback mechanism allowing for product ratings and verified comments.
- **Newsletter Integration**: Secure, rate-limited subscription engine for customer engagement.

## Architecture
ShadowGrid utilizes a modularized React architecture designed for high maintainability and performance.

### Tech Stack
| Layer | Technology |
|---|---|
| **Frontend** | React, Tailwind CSS 4, Framer Motion |
| **Backend** | Node.js, Express |
| **Database** | MongoDB (Mongoose ODM) |
| **Feedback** | React Hot Toast |

> **Design Note:** We migrated from a monolithic architecture to a modular component-based structure (separating Pages, Components, and Contexts) to optimize the build pipeline and facilitate rapid feature iteration.

## Security & Performance
- **Rate Limiting**: Security middleware (`express-rate-limit`) is active on authentication and subscription routes to prevent automated abuse.
- **Stateless Auth**: JWT-based authorization ensures secure access to protected user and administrative routes.
- **Optimized UI**: Tailored "Glassmorphism" effects are implemented using high-performance CSS utilities, minimizing custom style overrides.

## Admin Guide
Administrative privileges allow for the management of the product catalog and order tracking.

### Promotion to Admin
To elevate a standard user to administrative status, update the user document in MongoDB:
```javascript
db.users.updateOne({ email: "user@example.com" }, { $set: { role: "admin" } });
```

### Dashboard Access
Once authenticated as an administrator, the **Admin Dashboard** link will become visible in the navigation protocol, granting access to:
- **Inventory Management**: Add, modify, or decommission product modules.
- **Order Tracking**: Monitor real-time order status and fulfillment.

## License
Distributed under the MIT License. See `LICENSE` for further information.
