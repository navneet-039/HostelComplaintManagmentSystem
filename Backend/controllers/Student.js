import Complaint from "../models/Complaint.js";

import { generateComplaintId } from "../utils/GenerateComplaintId.js";

export const getAllStudentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      student: req.user.id,
      status: { $ne: "Resolved" },
    })
      .sort({ date: -1 })
      .populate("student")
      .populate("hostel");

    const formattedComplaints= complaints.map((complaint) => ({
      ...complaint.toObject(),
      complaintId: generateComplaintId(complaint),
    }));

    return res.status(200).json({
      success: true,
      formattedComplaints,
      message: "All complaints of students fetched successfully..",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching student's complaint...",
    });
  }
};
