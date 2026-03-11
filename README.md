# Grocery MERN Application

A full-stack grocery shopping application built with the MERN (MongoDB, Express, React, Node.js) stack.

## Features
- ✨ User Authentication (JWT)
- 🛒 Shopping Cart & Checkout
- 📦 Product Management
- ☁️ Cloud Image Storage (Cloudinary)
- 📍 Address Management
- 📉 Seller Dashboard

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB (local or Atlas)
- Cloudinary Account

### Backend Configuration
1. Navigate to the `backend` directory.
2. Create a `.env` file and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. Install dependencies: `npm install`
4. Start the server: `npm start`

### Client Configuration
1. Navigate to the `client` directory.
2. Create a `.env` file:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

## Recent Updates
- **Cloud Storage**: Integrated Cloudinary for all product images. Local storage is no longer required for new uploads.
- **Git Integration**: Project initialized and pushed to GitHub.

## License
MIT