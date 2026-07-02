import express from "express";
import {
  
  getAllStudentComplaints,
  
} from "../controllers/Student.js";
import { getNotice, publishNotice } from "../controllers/Notice.js";
import { auth, isStudent, isSupervisor } from "../middlewares/Auth.js";
import {getSupervisorComplaints} from "../controllers/Supervisor.js"
import {getAllStudent,getComplaintById} from "../controllers/Supervisor.js"

const router = express.Router();

router.get("/student/complaints", auth, isStudent, getAllStudentComplaints);
router.get("/hostel/complaints", auth, isSupervisor, getSupervisorComplaints);
router.get("/Allstudent", auth, isSupervisor, getAllStudent);
router.post("/setnotice", auth, isSupervisor, publishNotice);
router.get("/seeNotice", auth, getNotice);
router.get("/complaints/:id", auth,isSupervisor, getComplaintById);

export default router;
