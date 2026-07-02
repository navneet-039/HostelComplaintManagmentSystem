import User from "../models/User.js";
import Hostel from "../models/Hostel.js";
import HostelNotice from "../models/Notice.js";
import { pushEmailJob } from "../utils/sqs.js";
export const getNotice = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let hostelId;

    if (user.role === "Student") {
      if (!user.hostel) {
        return res.status(400).json({
          success: false,
          message: "Student is not assigned to any hostel",
        });
      }
      hostelId = user.hostel;
    } else if (user.role === "Supervisor") {
      if (!user.supervisorOfHostel) {
        return res.status(400).json({
          success: false,
          message: "Supervisor is not assigned to any hostel",
        });
      }
      hostelId = user.supervisorOfHostel;
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const notices = await HostelNotice.find({
      hostel: hostelId,
      isActive: true,
      $or: [
        { expiryDate: { $gte: new Date() } }, // not expired
        { expiryDate: null }, // no expiry
      ],
    })
      .sort({ createdAt: -1 })
      .populate("publishedBy", "name role")
      .populate("hostel", "name");

    return res.status(200).json({
      success: true,
      count: notices.length,
      notices,
    });
  } catch (error) {
    console.error("Get Notice Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const publishNotice = async (req, res) => {
  try {
    const { title, description, expiryDate } = req.body;
    const supervisor = await User.findById(req.user.id);
    if (!supervisor)
      return res
        .status(404)
        .json({ success: false, message: "Supervisor not found" });

    const hostel = await Hostel.findOne({ supervisor: req.user.id });
    if (!hostel)
      return res.status(404).json({
        success: false,
        message: "No hostel assigned to this supervisor",
      });

    const notice = await HostelNotice.create({
      title,
      description,
      hostel: hostel._id,
      publishedBy: req.user.id,
      expiryDate,
    });


    await pushEmailJob({
      type: "NOTICE",
      payload: {
        noticeId: notice._id,
        hostelId: hostel._id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Notice published successfully. Emails are being sent.",
      notice,
    });
  } catch (error) {
    console.error("Notice creation error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
