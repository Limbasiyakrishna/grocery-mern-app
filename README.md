# 🌿 FreshNest - Premium Grocery MERN Stack Platform

<div align="center">
  <img src="client/public/freshlogo.png" alt="FreshNest Logo" width="120px" />
  <p><i>The next generation of farm-to-table shopping.</i></p>
</div>

---

**FreshNest** is a comprehensive, production-ready MERN stack application designed for the modern grocery experience. It features a stunningly responsive frontend, high-security backend authentication, and seamless third-party integrations for media, email, and SMS notifications.

## 🚀 Key Features

-   **🎨 Premium UI/UX**: Crafted with Tailwind CSS and custom design tokens for a professional and fluid experience.
-   **🔐 Secure Auth**: Robust JWT-based authentication with cookie-based session management.
-   **🛒 Advanced Cart**: Real-time cart calculations and persistent state for a smooth shopping flow.
-   **👨‍💼 Seller Ecosystem**: Full-featured dashboard for sellers to manage products, tracks orders, and monitor sales.
-   **📷 Cloud-First Media**: Full Cloudinary integration for lightning-fast image delivery and management.
-   **📩 Notification Suite**: Automated emails for user welcome and SMS alerts via Twilio.
-   **🧩 Modular Architecture**: Clean, scalable codebase following the Controller-Middleware-Route pattern.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), Tailwind CSS, Framer Motion (animations), React Router 7.
-   **Backend**: Node.js, Express, MongoDB with Mongoose.
-   **Storage**: Cloudinary (Image management).
-   **Messaging**: Nodemailer (Email), Twilio (SMS).
-   **Security**: Bcrypt.js, JSON Web Tokens (JWT), Cookie-Parser.

## 📦 Project Structure

```bash
├── backend/
│   ├── config/       # Database & Cloudinary configurations
│   ├── controller/   # Core business logic
│   ├── middlewares/  # Auth & error handling
│   ├── models/       # Mongoose Schemas
│   ├── routes/       # API endpoints
│   └── utils/        # Messaging services (Email/SMS)
├── client/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Global state management
│   │   ├── pages/       # Page-level components
│   │   └── index.css    # Central design system
```

## ⚙️ Quick Start

### 1. Prerequisite Checklist
- **Node.js** (v18+)
- **MongoDB** (Local or Compass)
- **Cloudinary Account** (for images)
- **Twilio Account** (optional for SMS)
- **Gmail App Pass** (optional for emails)

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3. Client Setup
```bash
cd client
npm install
npm run dev
```

## 🧪 Deployment Notes
- Ensure `NODE_ENV` is set to `production` in your hosting environment.
- Update `FRONTEND_URL` in the backend `.env` to match your deployed domain.

---

<p align="center">
  Built with ❤️ by the FreshNest Team. 
  <br/>
  <i>Elevating the standard of online grocery shopping.</i>
</p>