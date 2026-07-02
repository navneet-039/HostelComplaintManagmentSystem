import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import s3 from "../Config/S3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { pushEmailJob } from "../utils/sqs.js";

export const registerComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const student = await User.findById(req.user.id).populate({
      path: "hostel",
      populate: {
        path: "supervisor",
        select: "email",
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // 1️ Create complaint FIRST
    const complaint = await Complaint.create({
      title,
      description,
      category,
      student: student._id,
      hostel: student.hostel,
      images: [],
    });

    const images = [];

    // 2️ Upload images using complaintId
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const key = `complaints/active/${student._id}/${
          complaint._id
        }/${Date.now()}-${file.originalname}`;

        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "bucket-owner-full-control",
          }),
        );

        images.push({
          key,
          url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        });
      }
    }

    // 3️ Save image references
    complaint.images = images;
    await complaint.save();

    await pushEmailJob({
      type: "COMPLAINT",
      payload: {
        complaintId: complaint._id,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Complaint registered successfully",
      complaint,
    });
  } catch (error) {
    console.error("registerComplaint error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while registering complaint",
    });
  }
};



export const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status } = req.body;

    if (!["Pending", "In_progress", "Resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const supervisor = await User.findById(req.user.id);
    if (!supervisor || supervisor.role !== "Supervisor") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    if (
      complaint.hostel.toString() !== supervisor.supervisorOfHostel.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // 1️ Archive images when resolved
    if (status === "Resolved" && !complaint.isArchived) {
      for (let img of complaint.images) {
        const oldKey = img.key;
        const newKey = oldKey.replace(
          "complaints/active/",
          "complaints/archive/",
        );

        await s3.send(
          new CopyObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            CopySource: `${process.env.AWS_BUCKET_NAME}/${oldKey}`,
            Key: newKey,
          }),
        );

        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: oldKey,
          }),
        );

        img.key = newKey;
        img.url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${newKey}`;
      }

      complaint.isArchived = true;
    }

    // 2️ Update complaint fields
    complaint.status = status;
    complaint.assignedBy = supervisor._id;

    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Complaint status updated",
      complaint,
    });
  } catch (error) {
    console.error("updateComplaintStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

