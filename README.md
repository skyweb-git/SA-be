# Edion Royal Guesthouse - Backend API 🏨

Production-ready Node.js & Express RESTful API with MongoDB (Mongoose), Cloudinary image uploads, and full booking management.

---

## 🚀 Features

- **MongoDB / Mongoose**: Schemas and validation for Rooms, Bookings, Guest Reviews, and Contact Inquiries.
- **Cloudinary Integration**: Direct buffer streaming for room and guesthouse photos via Multer (no temporary disk files needed).
- **Environment Config**: Robust `.env` and `.env.example` setup.
- **Complete Booking Workflow**: Handle reservation inquiries directly from the frontend.
- **Pre-configured Database Seeder**: Instant seeding of all 7 guesthouse rooms and guest reviews (`npm run seed`).
- **Health Check Endpoint**: Real-time status reporting for database and Cloudinary connectivity.

---

## 📁 Directory Structure

```
backend/
├── config/
│   ├── cloudinary.js       # Cloudinary v2 setup & stream upload helpers
│   └── db.js               # MongoDB connection logic with Mongoose
├── controllers/
│   ├── bookingController.js # Reservation & booking business logic
│   ├── contactController.js # Contact inquiries logic
│   ├── reviewController.js  # Guest reviews & testimonials logic
│   ├── roomController.js    # Rooms CRUD with Cloudinary support
│   └── uploadController.js  # Dedicated Cloudinary media upload routes
├── middleware/
│   ├── errorHandler.js     # 404 and global JSON error handler
│   └── upload.js           # Multer memory storage & image filter
├── models/
│   ├── Booking.js          # Booking enquiry Mongoose model
│   ├── Contact.js          # Contact inquiry Mongoose model
│   ├── Review.js           # Review Mongoose model
│   └── Room.js             # Room Mongoose model with Cloudinary array
├── routes/
│   ├── bookingRoutes.js    # /api/bookings endpoints
│   ├── contactRoutes.js    # /api/contact endpoints
│   ├── reviewRoutes.js     # /api/reviews endpoints
│   ├── roomRoutes.js       # /api/rooms endpoints
│   └── uploadRoutes.js     # /api/upload endpoints
├── utils/
│   └── seed.js             # Database seeder for rooms & reviews
├── .env                    # Active environment variables
├── .env.example            # Environment variables template
├── package.json
└── server.js               # Express application entrypoint
```

---

## ⚙️ Configuration (.env)

Edit `backend/.env` with your credentials:

```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Connection String (Atlas Cloud or Local)
# MongoDB Atlas: mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/edion_royal_guesthouse?retryWrites=true&w=majority
# Local MongoDB: mongodb://127.0.0.1:27017/edion_royal_guesthouse
MONGO_URI=mongodb://127.0.0.1:27017/edion_royal_guesthouse

# Cloudinary Credentials (https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Getting Cloudinary Credentials:
1. Sign up / Log in to [Cloudinary](https://cloudinary.com/).
2. On your Cloudinary Dashboard, copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. Paste them into `backend/.env`.

### Getting MongoDB Atlas URI:
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Click **Connect** -> **Drivers (Node.js)**.
3. Copy the connection string into `MONGO_URI` in `backend/.env`.

---

## 🛠️ Running the Backend

From the `backend/` directory:

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. (Optional) Seed initial guesthouse rooms and reviews into MongoDB
npm run seed

# 3. Start development server with auto-reload (nodemon)
npm run dev

# 4. Start production server
npm start
```

---

## 📡 API Endpoints

### 🩺 Health & System
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status and overview |
| `GET` | `/api/health` | Health check (DB connection & Cloudinary status) |

---

### 📅 Bookings & Reservations (`/api/bookings`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/bookings` | Submit new booking inquiry |
| `GET` | `/api/bookings` | List all bookings (`?status=pending`) |
| `GET` | `/api/bookings/:id` | Get single booking by ID |
| `PATCH`| `/api/bookings/:id` | Update status (`pending`, `confirmed`, `cancelled`) |
| `DELETE`| `/api/bookings/:id`| Delete booking |

#### Example Booking Request Body:
```json
{
  "name": "Thandi Molefe",
  "email": "thandi@example.com",
  "phone": "+27 78 123 4567",
  "room": "Renovated Double Room",
  "checkIn": "2026-11-01",
  "checkOut": "2026-11-05",
  "guestsCount": 2,
  "message": "Arriving late after 20:00."
}
```

---

### 🛏️ Rooms (`/api/rooms`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/rooms` | List all rooms |
| `GET` | `/api/rooms/:identifier` | Get room by slug or MongoDB ID |
| `POST` | `/api/rooms` | Create new room (supports `image` file upload to Cloudinary) |
| `PUT` | `/api/rooms/:id` | Update room (supports updating images via Cloudinary) |
| `DELETE`| `/api/rooms/:id` | Delete room and remove Cloudinary assets |

---

### ☁️ Cloudinary Uploads (`/api/upload`)
| Method | Endpoint | Payload | Description |
|---|---|---|---|
| `POST` | `/api/upload` | `multipart/form-data` with key `image` | Upload single photo to Cloudinary |
| `POST` | `/api/upload/multiple` | `multipart/form-data` with key `images` | Upload up to 8 photos to Cloudinary |
| `DELETE`| `/api/upload/:public_id`| URL param | Delete photo from Cloudinary |

---

### ⭐ Reviews (`/api/reviews`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reviews` | List all approved guest reviews |
| `POST` | `/api/reviews` | Submit new guest review |

---

### ✉️ Contact Inquiries (`/api/contact`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/contact` | Send inquiry / contact message |
| `GET` | `/api/contact` | List contact submissions |
