import { Router } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../../config/db.js";
import { sendSuccess, sendError } from "../../utils/apiResponse.js";

const router = Router();

// GET /api/user/services -> list all salon services
router.get("/services", async (req, res, next) => {
  try {
    const services = await getCollection("services")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return sendSuccess(res, services, "Services fetched successfully");
  } catch (error) {
    return next(error);
  }
});

// GET /api/user/services/:id -> single service
router.get("/services/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return sendError(res, "Invalid service id", 400);
    }

    const service = await getCollection("services").findOne({ _id: new ObjectId(id) });

    if (!service) {
      return sendError(res, "Service not found", 404);
    }

    return sendSuccess(res, service, "Service fetched successfully");
  } catch (error) {
    return next(error);
  }
});

// POST /api/user/bookings -> create a booking
router.post("/bookings", async (req, res, next) => {
  try {
    const { serviceId, customerName, customerEmail, bookingDate, note } = req.body || {};

    if (!serviceId || !customerName || !customerEmail || !bookingDate) {
      return sendError(
        res,
        "serviceId, customerName, customerEmail and bookingDate are required",
        400
      );
    }

    if (!ObjectId.isValid(serviceId)) {
      return sendError(res, "Invalid serviceId", 400);
    }

    const date = new Date(bookingDate);

    if (Number.isNaN(date.getTime())) {
      return sendError(res, "bookingDate must be a valid date", 400);
    }

    const service = await getCollection("services").findOne({
      _id: new ObjectId(serviceId),
    });

    if (!service) {
      return sendError(res, "Service not found", 404);
    }

    const booking = {
      serviceId: service._id,
      serviceName: service.name,
      price: service.price ?? null,
      customerName: String(customerName).trim(),
      customerEmail: String(customerEmail).trim().toLowerCase(),
      bookingDate: date,
      note: note ? String(note).trim() : "",
      status: "pending",
      createdAt: new Date(),
    };

    const result = await getCollection("bookings").insertOne(booking);

    return sendSuccess(
      res,
      { _id: result.insertedId, ...booking },
      "Booking created successfully",
      201
    );
  } catch (error) {
    return next(error);
  }
});

// GET /api/user/bookings?email=user@example.com -> bookings of one customer
router.get("/bookings", async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return sendError(res, "email query parameter is required", 400);
    }

    const bookings = await getCollection("bookings")
      .find({ customerEmail: String(email).trim().toLowerCase() })
      .sort({ bookingDate: -1 })
      .toArray();

    return sendSuccess(res, bookings, "Bookings fetched successfully");
  } catch (error) {
    return next(error);
  }
});

export default router;
