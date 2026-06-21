# Project: Country Side Cafe — Full Stack Food Ordering Web App

Country Side Cafe is a modern full-stack food ordering platform inspired by the warmth and heritage of Rajasthan. The project combines a premium React frontend with a secure Django REST Framework backend to create a seamless restaurant ordering experience.

The platform is designed to deliver a beautiful cafe browsing experience, secure authentication, smooth cart management, online ordering, wishlist functionality, and a complete admin management system.

---

# Project Overview

Country Side Cafe provides customers with an immersive digital cafe experience where users can:

- Explore traditional and modern food items
- Search and filter menu items
- Add products to cart or wishlist
- Place orders through checkout
- Manage authentication securely
- Experience responsive design with smooth animations
- Access admin controls for managing products, users, and orders

The application follows a frontend-backend architecture using React for UI and Django REST Framework for APIs.

---

# Tech Stack

## Frontend

Built with modern frontend technologies for performance and smooth user experience.

- React.js
- Vite
- Tailwind CSS
- Framer Motion
- React Router DOM v6
- Context API
- Axios
- React Icons
- LocalStorage Persistence

## Backend

Built with Django ecosystem for scalable APIs and secure authentication.

- Django
- Django REST Framework
- JWT Authentication (SimpleJWT)
- SQLite / PostgreSQL
- Django Jazzmin Admin Dashboard
- Django Custom User Model

---

# Key Features

## Frontend Features

### Home Page

- Premium Rajasthan-inspired hero section
- Featured dishes section
- Category highlights
- Cafe storytelling section
- Testimonials section
- Responsive navigation bar

### Menu Page

- Search menu items
- Category filtering
- Price filtering
- Rating filtering
- Sorting options
- Pagination support
- Dynamic product cards

### Product Detail Page

- Multiple food images
- Dish details and description
- Ingredients/specifications
- Related dishes suggestions
- Add to cart
- Add to wishlist

### Cart System

- Real-time cart updates
- Sidebar mini cart
- Full cart page
- Quantity adjustments
- Price calculations
- Remove items functionality

### Checkout System

- Customer information form
- Order summary
- Delivery details
- Mock payment flow
- Responsive checkout UI

### Authentication

- User Login
- User Registration
- Forgot Password UI
- JWT Token authentication
- Secure protected routes

### Wishlist

- Save favorite dishes
- Remove wishlist items
- Persistent user experience

### Dark Mode

- Light/Dark theme toggle
- Theme persistence using localStorage

### Admin Dashboard

- Manage products
- Manage orders
- Manage users
- View analytics overview

---

## Backend Features

### Authentication API

- JWT Login
- Register User
- Token Refresh
- Protected endpoints

### Product Management API

- Create food items
- Update menu items
- Delete menu items
- Product category handling
- Product image support

### Order Management API

- Create orders
- Order history
- Track order status
- Update order lifecycle

### Cart API

- Add item to cart
- Remove item from cart
- Update quantity
- Retrieve user cart

### Wishlist API

- Add favorites
- Remove favorites
- Retrieve wishlist

### Admin Panel

- Jazzmin admin UI
- Product management
- User management
- Order monitoring

---

# Project Folder Structure

```bash
Country-Side-Cafe/
│
├── backend/
│   ├── cafe_backend/
│   ├── accounts/
│   ├── products/
│   ├── orders/
│   ├── cart/
│   ├── wishlist/
│   ├── media/
│   ├── requirements.txt
│   ├── manage.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── assets/
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│
├── README.md
└── .gitignore
```

---

# Installation Guide

## Backend Setup (Django)

### Step 1: Navigate to backend

```bash
cd backend
```

### Step 2: Create virtual environment

```bash
python3 -m venv venv
```

### Step 3: Activate environment

#### Windows

```bash
venv\Scripts\activate
```

#### Mac/Linux

```bash
source venv/bin/activate
```

### Step 4: Install dependencies

```bash
pip install -r requirements.txt
```

### Step 5: Apply migrations

```bash
python3 manage.py migrate
```

### Step 6: Create admin user

```bash
python3 manage.py createsuperuser
```

### Step 7: Start backend server

```bash
python3 manage.py runserver
```

Backend server:

```bash
http://127.0.0.1:8000/
```

---

## Frontend Setup (React)

### Step 1: Navigate to frontend

```bash
cd frontend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Start development server

```bash
npm run dev
```

Frontend server:

```bash
http://localhost:5173/
```

---

# API Architecture

The frontend communicates with Django backend through REST APIs.

### API Modules

- Authentication API
- Products API
- Cart API
- Wishlist API
- Orders API
- User Profile API

Example API endpoint structure:

```bash
/api/auth/
/api/products/
/api/orders/
/api/cart/
/api/wishlist/
```

---

# Authentication Flow

1. User logs in using credentials.
2. Django returns JWT access token.
3. Token stored in localStorage.
4. Protected routes use JWT verification.
5. Refresh token maintains session.

---

# State Management

React Context API handles global state.

### Context Modules

- AuthContext
- CartContext
- WishlistContext
- ThemeContext

This helps maintain consistent data throughout the app.

---

# UI Design Philosophy

Country Side Cafe follows a premium Rajasthani-inspired design system.

### Design Elements

- Warm earthy colors
- Desert-inspired tones
- Traditional patterns
- Smooth animations
- Rounded UI cards
- Elegant typography
- Responsive layouts
- Heritage-inspired aesthetics

---

# Future Improvements

Potential future upgrades:

- Online payment gateway integration
- Google Authentication
- Real-time order tracking
- Push notifications
- Coupon system
- Review and ratings API
- Multi-vendor restaurant support
- AI-powered food recommendations

---

# Environment Variables

## Backend `.env`

```env
SECRET_KEY=your_secret_key
DEBUG=True
DATABASE_URL=your_database_url
JWT_SECRET_KEY=your_jwt_secret
```

## Frontend `.env`

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

---

# Admin Dashboard

Django Jazzmin admin panel:

```bash
http://127.0.0.1:8000/admin/
```

Use superuser credentials to manage:

- Products
- Users
- Orders
- Categories
- Cart Data
- Wishlist Data

---

# Deployment Suggestions

## Frontend Hosting

- Vercel
- Netlify
- Firebase Hosting

## Backend Hosting

- Render
- Railway
- DigitalOcean
- AWS
- PythonAnywhere

---

# License

MIT License

---

# Developer

Developed by Rajan as a full-stack portfolio project inspired by Rajasthani culture and modern web development practices.

