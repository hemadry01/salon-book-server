import { Router } from "express";
import { getCollection } from "../../config/db.js";

const router = Router();

const BOOKING_STATUSES = ["pending", "confirmed", "cancelled", "completed"];

router.get("/users", async(req,res)=>{

  try {
    const users = getCollection("user");

    const cursor =  users.find({});
    const result = await cursor.toArray();

    res.status(200).send({
      success:true,
      message: "User fetched successfully",
      data:result,
    });

  }
  catch (error) {
    res.status(500).send({
      success:false,
      message:"Failed to fetch users",
      error:error.message,
    });
  }
})


export default router;
