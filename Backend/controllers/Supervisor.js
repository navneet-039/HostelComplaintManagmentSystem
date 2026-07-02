import User from "../models/User.js";

import bcrypt from "bcryptjs";

import Hostel from "../models/Hostel.js";
import jwt from "jsonwebtoken";

import Complaint from "../models/Complaint.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../Config/S3.js";
import { pushEmailJob } from "../utils/sqs.js";
import { generateComplaintId } from "../utils/GenerateComplaintId.js";

export const registerStudent = async (req, res) => {
  try {
    console.log("Register Student API");

    const {
      name,
      email,
      phone,
      registrationNumber,
      password,
      branch,
      year,
      roomNumber,
      floor,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !phone ||
      !registrationNumber ||
      !password ||
      !branch ||
      !year ||
      !roomNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { registrationNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Student already registered",
      });
    }

    // Validate supervisor
    const supervisor = await User.findById(req.user.id).populate(
      "supervisorOfHostel"
    );

    if (!supervisor || supervisor.role !== "Supervisor") {
      return res.status(403).json({
        success: false,
        message: "Only supervisors can register students",
      });
    }

    if (!supervisor.supervisorOfHostel) {
      return res.status(400).json({
        success: false,
        message: "Supervisor hostel not assigned",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const student = await User.create({
      name,
      email,
      phone,
      registrationNumber,
      password: hashedPassword,
      branch,
      year,
      roomNumber,
      floor,
      hostel: supervisor.supervisorOfHostel._id,
      role: "Student",
    });

    // Add student to hostel
    await Hostel.findByIdAndUpdate(supervisor.supervisorOfHostel._id, {
      $push: { students: student._id },
    });

    // Send registration email
    const resetLink = `http://localhost:5173/reset-password?email=${email}`;

    await pushEmailJob({
      type: "STUDENT_REGISTRATION",
      payload: {
        email,
        password,
        registrationNumber,
        supervisorName: supervisor.supervisorOfHostel.name,
        roomNumber,
        floor,
        resetLink,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        registrationNumber: student.registrationNumber,
        branch: student.branch,
        year: student.year,
        roomNumber: student.roomNumber,
        floor: student.floor,
        hostel: supervisor.supervisorOfHostel.name,
      },
    });
  } catch (error) {
    console.error("Register Student Error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);

      return res.status(400).json({
        success: false,
        message: errors[0],
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];

      return res.status(400).json({
        success: false,
        message: `${field} already exists.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getSupervisorComplaints = async (req, res) => {
  try {
    const supervisor = await User.findById(req.user.id);

    if (!supervisor || supervisor.role !== "Supervisor") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!supervisor.supervisorOfHostel) {
      return res.status(400).json({
        success: false,
        message: "Supervisor hostel not assigned",
      });
    }

    const complaints = await Complaint.find({
      hostel: supervisor.supervisorOfHostel,
      status: { $in: ["Pending", "In_progress"] },
    })
      .populate("student", "name registrationNumber roomNumber floor")
      .sort({ createdAt: -1 });

      const formattedComplaints= complaints.map((complaint) => ({
      ...complaint.toObject(),
      complaintId: generateComplaintId(complaint),
    }));

    return res.status(200).json({
      success: true,
      formattedComplaints,
    });
  } catch (error) {
    console.error(" getSupervisorComplaints error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllStudent = async (req, res) => {
  try {
    const supervisor = await User.findById(req.user.id);

    if (!supervisor || supervisor.role !== "Supervisor") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const hostelId = supervisor.supervisorOfHostel;

    if (!hostelId) {
      return res.status(400).json({
        success: false,
        message: "Supervisor not assigned to any hostel",
      });
    }

    // Fetch students and populate the hostel name
    const students = await User.find({
      role: "Student",
      hostel: hostelId,
    })
      .select(
        "name email phone registrationNumber roomNumber floor branch year hostel",
      )
      .populate({
        path: "hostel",
        select: "name", // only get the hostel name
      });

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("getAllStudent error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// controllers/complaintController.js

export const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id)
      .populate("student", "name email")
      .populate("hostel", "name")
      .populate("assignedBy", "name email");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    //  Generate fresh presigned URLs
    const imagesWithSignedUrls = await Promise.all(
      complaint.images.map(async (img) => {
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: img.key,
        });

        const signedUrl = await getSignedUrl(s3, command, {
          expiresIn: 60 * 60, // 1 hour
        });

        return {
          key: img.key,
          url: signedUrl,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      complaint: {
        ...complaint.toObject(),
        images: imagesWithSignedUrls,
      },
    });
  } catch (error) {
    console.error("getComplaintById error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
