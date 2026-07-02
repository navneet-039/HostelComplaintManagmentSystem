import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    registrationNumber: {
      type: String,
      unique: true,
      trim: true,
      required: function () {
        return this.role === "Student";
      },
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["Student", "Supervisor", "Chief_warden"],
      required: true,
    },

    // -------- Student fields --------
    roomNumber: {
      type: String,
      required: function () {
        return this.role === "Student";
      },
    },

    floor: {
      type: String,
      default: null,
    },

    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      default: null,
    },

    branch: {
      type: String,
      required: function () {
        return this.role === "Student";
      },
    },

    year: {
      type: String,
      required: function () {
        return this.role === "Student";
      },
    },

    // -------- Supervisor fields --------
    supervisorOfHostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      default: null,
    },

    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
