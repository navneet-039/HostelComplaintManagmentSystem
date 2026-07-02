import mongoose from "mongoose";

const HostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    capacity: Number,

    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Hostel", HostelSchema);
