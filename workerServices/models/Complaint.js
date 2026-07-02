import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["Electricity", "Water", "Furniture", "Cleaning", "Other"],
      required: true,
    },
     images: [
      {
        url: {
          type: String,
          required: true,
        },
        key: {
          type: String,
          required: true,
        },
      },
    ],

    isArchived: {
      type: Boolean,
      default: false,
    },


    status: {
      type: String,
      enum: ["Pending", "In_progress", "Resolved"],
      default: "Pending",
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Supervisor
      default: null,
    },

    // Optional worker name (if supervisor assigns)
    assignedWorkerName: {
      type: String,
      default: null,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", ComplaintSchema);
