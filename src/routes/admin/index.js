import { Router } from "express";
import { getCollection } from "../../config/db.js";

const router = Router();

const BOOKING_STATUSES = ["pending", "confirmed", "cancelled", "completed"];



export default router;
