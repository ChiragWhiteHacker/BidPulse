# BidPulse ⚡

**BidPulse** is a premium, real-time Bidding Management System (BMS) designed to facilitate secure, high-stakes auctions. It features a sophisticated "Anti-Sniping" mechanism, an Escrow financial model, and distinct interfaces for Bidders, Sellers, and Administrators.

![Project Status](https://img.shields.io/badge/Status-In%20Development-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Key Features

### 🧠 Intelligent Bidding Engine
* **Real-Time Updates:** Instant price updates across all connected clients using **Socket.io**. No page refreshes required.
* **"Soft Close" Logic:** If a bid is placed in the last 5 minutes, the auction timer automatically extends by 5 minutes. This prevents "sniping" and mimics real-world auction dynamics.
* **Smart Validation:** Prevents users from bidding on their own items or bidding below the increment threshold.

### 🛡️ Trust & Safety
* **Stripe Escrow Payments:** Winning bids are held in a secure platform account. Funds are only released to the Seller after the Buyer confirms receipt of the item.
* **Seller Controls:** Sellers can block specific users from interacting with their listings.
* **Admin Oversight:** Complete control to ban users and force-close illegal auctions.

### 📧 Automated Notification System
The system handles communication automatically via email:
1.  **Auction Won:** Notifies Winner (Pay Now) and Seller (Item Sold).
2.  **Payment Made:** Sends Invoice to Winner and "Ready to Ship" alert to Seller.
3.  **Order Completed:** Releases funds and sends "Thank You" notes upon delivery confirmation.

---

## 👥 User Roles & Workflows

### 1. Bidder (The Buyer) - *Indigo Theme*
* Live Dashboard tracking Winning, Outbid, and Completed auctions.
* Watchlist functionality.
* Seamless checkout experience via Stripe.

### 2. Seller (The Auctioneer) - *Emerald Theme*
* Inventory management (Create/Edit/Delete).
* Order fulfillment tracking (Ship items).
* Earnings reports (Net profit after commission).

### 3. Admin (The Moderator) - *Slate Theme*
* **Business Logic:** Automatically collects an **8% commission** on every sale.
* User management (Ban/Unban).
* Platform-wide analytics.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Fast, interactive UI with TailwindCSS. |
| **Backend** | Node.js + Express | RESTful API and Business Logic. |
| **Database** | MongoDB | Mongoose schemas for dynamic auction data. |
| **Real-Time** | Socket.io | Bi-directional communication for timers/bids. |
| **Payments** | Stripe Connect | Handling Escrow and Commission splits. |
| **Email** | Nodemailer | Transactional email delivery. |
| **DevOps** | Docker | Containerized development environment. |

---

## 📂 Architecture Overview

### The "Soft Close" Algorithm
```javascript
IF (CurrentTime + 5 mins > AuctionEndTime) {
    NewEndTime = CurrentTime + 5 mins;
    Broadcast(NewEndTime);
}

The Escrow Flow
Winner Pays -> Funds move to Stripe Platform Account.

Seller Ships -> Funds remain Held.

Buyer Confirms -> 92% transferred to Seller Bank; 8% retained as Revenue.

🚀 Getting Started
Instructions for setting up the project locally.

Prerequisites
Node.js (v18+)

Docker Desktop (Optional, for containerization)

MongoDB Local or Atlas URI

Installation
Clone the repository

Bash

git clone [https://github.com/your-username/BidPulse.git](https://github.com/your-username/BidPulse.git)
cd BidPulse
Install Dependencies

Bash

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
Environment Variables

Create a .env file in both backend and frontend directories based on .env.example.

Run the App

Bash

# Run Backend (Port 5000)
npm run dev

# Run Frontend (Port 5173)
npm run dev
📜 License
This project is licensed under the MIT License.


***

### Next Step
Once you have created the repo and added this README, we are ready to initialize the project folders and run the installation commands.

Let me know when the repo is live!