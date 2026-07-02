import express from "express";
import { auth, isSupervisor, isStudent } from "../middlewares/Auth.js";
import {
  registerComplaint,
  updateComplaintStatus,
} from "../controllers/Complaint.js";
import { getAllStudent } from "../controllers/Supervisor.js";
import upload from "../middlewares/multer.js";
import rateLimiter from "../middlewares/rateLimiter.js";

const router = express.Router();

const complaintLimiter = rateLimiter({
  prefix: "complaint",
  limit: 2,
  windowInSeconds: 60,
  keyGenerator: (req) => req.user.id,
});

router.post(
  "/register",
  auth,
  isStudent,
  complaintLimiter,
  upload.array("images", 5),
  registerComplaint,
);

router.patch(
  "/status/:complaintId",
  auth,
  isSupervisor,
  updateComplaintStatus,
  getAllStudent,
);

export default router;
