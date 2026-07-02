import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const auth = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token missing or invalid",
      });
    }

    const accessToken = authorizationHeader.split(" ")[1];

    const decode = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export const isStudent = async (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      return res.status(401).json({
        success: false,
        message: "Route not allowed to students",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const isSupervisor = async (req, res, next) => {
  try {
   
    if (req.user.role !== "Supervisor") {
      return res.status(401).json({
        success: false,
        message: "Route not allowed to supervisor",
      });
    }
     console.log("hii after isSupervisor middleware");

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const isWarden = async (req, res, next) => {
  try {
    if (req.user.role !== "Chief_warden") {
      return res.status(401).json({
        success: false,
        message: "Route not allowed to Chief_warden",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
