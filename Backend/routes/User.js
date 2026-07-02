import express from "express";
import { auth,isStudent,isSupervisor } from "../middlewares/Auth.js";
import { loginController, changePassword,refreshAccessToken ,createSupervisor,createHostel,logoutUser} from "../controllers/Auth.js";

import { registerStudent } from "../controllers/Supervisor.js";
const router = express.Router();

router.post("/login", loginController);
router.post("/register",auth,isSupervisor, registerStudent);
router.post("/change-password", changePassword);
router.get("/refresh-token", refreshAccessToken);
router.post("/create-supervisor",createSupervisor);
router.post("/create-hostel",createHostel);
router.post("/logout",logoutUser)


export default router;
