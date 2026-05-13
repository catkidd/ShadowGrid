# MongoDB Atlas & Compass — ShadowGrid Setup Guide

> **Audience:** Developers working on the ShadowGrid backend. This guide covers creating a free Atlas cluster, securing it, connecting MongoDB Compass as a GUI, and performing CRUD operations both through the REST API and directly inside Compass.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Create a Free MongoDB Atlas Cluster](#2-create-a-free-mongodb-atlas-cluster)
3. [Configure Network Access & Database Users](#3-configure-network-access--database-users)
4. [Get Your Connection String](#4-get-your-connection-string)
5. [Connect the ShadowGrid Server to Atlas](#5-connect-the-shadowgrid-server-to-atlas)
6. [Seed the Database](#6-seed-the-database)
7. [Connect MongoDB Compass to Atlas](#7-connect-mongodb-compass-to-atlas)
8. [CRUD Operations via the REST API](#8-crud-operations-via-the-rest-api)
9. [CRUD Operations Directly in MongoDB Compass](#9-crud-operations-directly-in-mongodb-compass)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites

Ensure the following are installed and available before proceeding.

| Requirement | Version / Notes |
|---|---|
| Node.js | `>= 18.x` |
| npm | `>= 9.x` |
| MongoDB Compass | Latest stable — [Download here](https://www.mongodb.com/try/download/compass) |
| A MongoDB Atlas account | Free at [cloud.mongodb.com](https://cloud.mongodb.com) |
| ShadowGrid server running | `cd server && node server.js` |

---

## 2. Create a Free MongoDB Atlas Cluster

**Step 1 — Sign up or log in**

Navigate to [https://cloud.mongodb.com](https://cloud.mongodb.com) and create a free account or log in.

**Step 2 — Create a new project**

1. Click **"New Project"** in the top-left dropdown.
2. Name it `ShadowGrid` and click **"Next"**.
3. Skip adding members. Click **"Create Project"**.

**Step 3 — Build a free cluster**

1. Click **"Build a Database"**.
2. Select the **Free** (M0) tier.
3. Choose a cloud provider and region closest to you (e.g., `AWS / ap-south-1` for South Asia).
4. Name the cluster `Cluster0` (this matches the existing connection string in `.env`).
5. Click **"Create Deployment"**.

> **Design Note:** The M0 free tier is sufficient for development and light production use. It provides 512 MB of storage and shared RAM. Upgrade to M10+ when sustained write throughput becomes a bottleneck.

---

## 3. Configure Network Access & Database Users

Atlas blocks all connections by default. You must explicitly allow access.

### 3.1 — Create a Database User

1. In the left sidebar, go to **Security → Database Access**.
2. Click **"Add New Database User"**.
3. Select **Password** authentication.
4. Set the username to `catkidd` (matches your existing `.env`).
5. Set a strong password — copy it immediately.
6. Under **Built-in Role**, select **"Atlas admin"**.
7. Click **"Add User"**.

> **⚠️ Warning:** Never commit real credentials to your repository. Your `.env` file should be listed in `.gitignore`.

### 3.2 — Whitelist Your IP Address

1. In the left sidebar, go to **Security → Network Access**.
2. Click **"Add IP Address"**.
3. Choose one of the following:
   - **"Add Current IP Address"** — for local development only.
   - **"Allow Access from Anywhere"** (`0.0.0.0/0`) — required for Render.com or any cloud deployment.
4. Click **"Confirm"**.

> **Design Note:** `0.0.0.0/0` is acceptable for Render deployments because the server authenticates via credentials. For production, restrict to known Render egress IPs or use VPC peering.

---

## 4. Get Your Connection String

1. On your Atlas cluster page, click **"Connect"**.
2. Select **"Drivers"**.
3. Choose **Node.js** as the driver.
4. Copy the connection string. It will look like this:

```
mongodb+srv://<username>:<password>@cluster0.pvnge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

5. Replace `<username>` with `catkidd` and `<password>` with the password you set in Step 3.1.
6. Append the database name `shadowgrid` before the query string:

```
mongodb+srv://catkidd:<password>@cluster0.pvnge.mongodb.net/shadowgrid?retryWrites=true&w=majority&appName=Cluster0
```

---

## 5. Connect the ShadowGrid Server to Atlas

Open `server/.env` and set `MONGODB_URI` to the connection string from Step 4:

```dotenv
PORT=5000
MONGODB_URI=mongodb+srv://catkidd:<YOUR_PASSWORD>@cluster0.pvnge.mongodb.net/shadowgrid?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=shadowgrid_neural_protocol_v4_secret_key_2026
VITE_API_URL=https://shadowgrid-x8m6.onrender.com
```

Replace `<YOUR_PASSWORD>` with the actual password. Do **not** use angle brackets in the final string.

**Verify the connection:**

```powershell
cd server
node server.js
```

You should see:

```
MongoDB Connected
Server is running!
Local:  http://localhost:5000
```

If you see `MongoDB Connection Error`, jump to [Section 10 — Troubleshooting](#10-troubleshooting).

---

## 6. Seed the Database

The `seed-admin.js` script creates the default admin user in Atlas. Run it once after the connection is verified:

```powershell
cd server
node seed-admin.js
```

Expected output:
MongoDB Connected for seeding...
Default admin account created successfully!
Email:    admin@shadowgrid.com
Password: admin_password_2026
```

After seeding, the `users` collection will exist in Atlas with one admin document.

> **Design Note:** The seeder is idempotent — running it multiple times is safe. If the admin already exists, it updates the role to `admin` rather than creating a duplicate.

---

## 7. Connect MongoDB Compass to Atlas

MongoDB Compass (Mongo DB GUI) lets you browse collections, run queries, and manage documents without writing code.

### 7.1 — Get the Compass Connection String

1. On your Atlas cluster page, click **"Connect"**.
2. Select **"Compass"**.
3. Copy the connection string. It will look like:

```
mongodb+srv://catkidd:<password>@cluster0.pvnge.mongodb.net/
```

4. Replace `<password>` with your actual password.

### 7.2 — Connect in Compass

1. Open **MongoDB Compass**.
2. On the home screen, paste the connection string into the **"URI"** field.
3. Click **"Connect"**.
4. After a few seconds, the left sidebar will list your databases. Click **`shadowgrid`** to expand it.
5. You will see two collections: **`products`** and **`users`**.

### 7.3 — Save the Connection (Optional)

1. After connecting, click the **"Save"** button next to the URI field.
2. Name it `ShadowGrid Atlas`.
3. This lets you reconnect in one click on future sessions.

---

## 8. CRUD Operations via the REST API

The ShadowGrid server exposes a RESTful API. All write operations on products require an admin JWT token.

### 8.1 — Authenticate and Get a Token

```powershell
# POST /api/auth/login
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@shadowgrid.com","password":"admin_password_2026"}'
```

The response contains a JWT token:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "email": "admin@shadowgrid.com", "role": "admin" }
}
```

Copy the `token` value. You will pass it as `Authorization: Bearer <token>` on all protected requests.

---

### 8.2 — CREATE — Add a New Product

```powershell
curl -X POST http://localhost:5000/api/products `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer <YOUR_TOKEN>" `
  -d '{
    "sku": "SG-HS-Z1",
    "name": "ZeroNoise Pro",
    "brand": "ShadowGrid",
    "category": "Headsets",
    "price": 299.99,
    "salePrice": 249.99,
    "originalPrice": 299.99,
    "specs": ["50mm Drivers", "ANC", "30hr Battery"],
    "stock": 40,
    "description": "Studio-grade wireless headset with active noise cancellation.",
    "imageURL": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
  }'
```

**Success response (`201 Created`):**

```json
{
  "_id": "6641a2b3c0f1e2a3b4c5d6e7",
  "sku": "SG-HS-Z1",
  "name": "ZeroNoise Pro",
  ...
}
```

---

### 8.3 — READ — Fetch All Products

```powershell
curl http://localhost:5000/api/products
```

**Fetch a single product by ID:**

```powershell
curl http://localhost:5000/api/products/6641a2b3c0f1e2a3b4c5d6e7
```

---

### 8.4 — UPDATE — Edit a Product

```powershell
curl -X PUT http://localhost:5000/api/products/6641a2b3c0f1e2a3b4c5d6e7 `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer <YOUR_TOKEN>" `
  -d '{
    "price": 279.99,
    "salePrice": 229.99,
    "stock": 35
  }'
```

**Success response (`200 OK`):**

```json
{
  "_id": "6641a2b3c0f1e2a3b4c5d6e7",
  "name": "ZeroNoise Pro",
  "price": 279.99,
  "salePrice": 229.99,
  "stock": 35,
  ...
}
```

---

### 8.5 — DELETE — Remove a Product

```powershell
curl -X DELETE http://localhost:5000/api/products/6641a2b3c0f1e2a3b4c5d6e7 `
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**Success response (`200 OK`):**

```json
{ "message": "Product deleted successfully" }
```

---

## 9. CRUD Operations Directly in MongoDB Compass

Compass provides a full GUI for all CRUD operations. No code required.

### 9.1 — CREATE — Insert a New Document

1. In Compass, click the **`products`** collection under `shadowgrid`.
2. Click the **"Add Data"** button → **"Insert Document"**.
3. Switch to the **"JSON view"** tab and paste:

```json
{
  "sku": "SG-HS-Z1",
  "name": "ZeroNoise Pro",
  "brand": "ShadowGrid",
  "category": "Headsets",
  "price": 299.99,
  "salePrice": 249.99,
  "originalPrice": 299.99,
  "specs": ["50mm Drivers", "ANC", "30hr Battery"],
  "stock": 40,
  "description": "Studio-grade wireless headset with active noise cancellation.",
  "imageURL": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
  "rating": 0,
  "reviewsCount": 0,
  "reviews": []
}
```

4. Click **"Insert"**. MongoDB automatically assigns an `_id` (ObjectId).

---

### 9.2 — READ — Query Documents

**View all products:**

Leave the filter bar empty and click **"Find"**. All documents display in the results panel.

**Filter by category:**

```json
{ "category": "Keyboards" }
```

**Filter by price range:**

```json
{ "price": { "$gte": 100, "$lte": 300 } }
```

**Find a specific product by name:**

```json
{ "name": "ShadowBlade X1" }
```

> **Design Note:** Compass uses MongoDB Query Language (MQL) in the filter bar — the same syntax used in `mongoose` query methods like `Product.find({ category: "Keyboards" })`.

---

### 9.3 — UPDATE — Edit a Document

1. Hover over a document in the results list.
2. Click the **pencil (edit) icon** that appears on the right.
3. Modify any field inline. For example, change `stock` from `15` to `10`.
4. Click **"Update"** to save.

**Bulk update via the filter bar:**

For multi-document updates, switch to the **"Documents"** tab and click **"Update Documents"**:

- Filter: `{ "category": "Mice" }`
- Update: `{ "$set": { "brand": "ShadowGrid" } }`

---

### 9.4 — DELETE — Remove a Document

1. Hover over the document you want to delete.
2. Click the **trash (delete) icon** on the right.
3. Confirm deletion in the popup.

**Delete multiple documents:**

Use the **"Delete Documents"** option in the toolbar with a filter:

```json
{ "stock": { "$eq": 0 } }
```

This removes all out-of-stock products.

---

### 9.5 — Verify the `users` Collection

After running `seed-admin.js`, open the **`users`** collection in Compass. You should see:

```json
{
  "_id": ObjectId("..."),
  "email": "admin@shadowgrid.com",
  "password": "$2b$10$...",   // bcrypt hash — never stored as plaintext
  "role": "admin",
  "createdAt": ISODate("...")
}
```

---

## 10. Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `Authentication failed` | Wrong password in connection string | Re-check the password in Atlas → Database Access |
| `IP not whitelisted` | Your current IP is blocked | Add your IP in Atlas → Network Access |
| `MongoServerSelectionError` | Atlas cluster is paused (M0 clusters pause after 60 days of inactivity) | Log into Atlas and click **"Resume"** on the cluster |
| `useMock = true` in logs | `MONGODB_URI` is wrong or unreachable | Verify the full URI in `.env`, including the database name `shadowgrid` |
| `Cannot find module './models/Product'` | Running `node server.js` from the wrong directory | Always run from inside `server/` |
| `CORS error` in browser | Frontend origin not in the CORS allowlist | Add your dev URL to the `origin` array in `server.js` |
| `JWT 401 Unauthorized` | Token expired or not passed | Re-login to get a fresh token; tokens expire in `24h` |
| `duplicate key error` on `sku` | A product with that SKU already exists | Use a unique SKU value for each product |

---

## Quick Reference — API Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Log in; returns JWT token |
| `GET` | `/api/auth/me` | Yes | Get the authenticated user's profile |
| `GET` | `/api/products` | No | Fetch all products |
| `GET` | `/api/products/:id` | No | Fetch a single product |
| `POST` | `/api/products` | Yes (Admin) | Create a new product |
| `PUT` | `/api/products/:id` | Yes (Admin) | Update an existing product |
| `DELETE` | `/api/products/:id` | Yes (Admin) | Delete a product |
| `POST` | `/api/orders` | No | Process a cart order |

---

*Generated for the ShadowGrid project — `server/server.js` + `server/models/`*
