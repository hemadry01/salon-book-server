# Salon Book Server

Basic Express.js + MongoDB backend for the Salon Book app.

## Setup

```bash
npm install
cp .env.example .env   # then fill in your own DB_URL
npm run dev
```

The server starts on `http://localhost:5000` by default.

## Folder structure

```
index.js                 # entry point
src/
  index.js               # express app + server startup
  config/
    env.js               # environment variables
    db.js                # MongoDB connection
  middleware/
    notFound.js          # 404 handler
    errorHandler.js      # central error handler
  routes/
    user/index.js        # customer endpoints
    admin/index.js       # admin endpoints
  utils/
    apiResponse.js       # shared success/error response helpers
```

## API response shape

```json
{ "success": true, "message": "Services fetched successfully", "data": [] }
```

Errors use the same shape with `success: false` and an optional `details` field.

## Endpoints

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/` | API info |
| GET | `/api/health` | Health check |
| GET | `/api/user/services` | List services |
| GET | `/api/user/services/:id` | Get one service |
| POST | `/api/user/bookings` | Create a booking |
| GET | `/api/user/bookings?email=` | Get a customer's bookings |
| GET | `/api/admin/bookings?status=` | List all bookings |
| PATCH | `/api/admin/bookings/:id/status` | Update booking status |
| POST | `/api/admin/services` | Create a service |
| DELETE | `/api/admin/services/:id` | Delete a service |

### Create booking body

```json
{
  "serviceId": "665f...",
  "customerName": "Jane Doe",
  "customerEmail": "jane@example.com",
  "bookingDate": "2026-12-01T10:00:00.000Z",
  "note": "Optional note"
}
```

### Create service body

```json
{
  "name": "Haircut",
  "description": "Classic haircut",
  "price": 250,
  "duration": 30
}
```
