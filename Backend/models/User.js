import mongoose from "mongoose";

const BRANCHES = [
  "CSE",
  "ECE",
  "EEE",
  "CE",
  "ME",
  "IT",
];


const BRANCH_CODES = {
  CSE: "CS",
  ECE: "EC",
  EEE: "EE",
  CE: "CE",
  ME: "ME",
  IT: "IT",
};

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
      uppercase: true,
      required: function () {
        return this.role === "Student";
      },
      validate: [
        {
          validator: function (value) {
            if (this.role !== "Student") return true;

            return /^\d{4}(UG|PG)[A-Z]{2}\d{3}$/.test(value);
          },
          message: "Registration number is not in correct format.",
        },
        {
          validator: function (value) {
            if (this.role !== "Student") return true;

            const match = value.match(
              /^\d{4}(UG|PG)([A-Z]{2})\d{3}$/
            );

            if (!match) return true; 

            const regBranchCode = match[2];

            return regBranchCode === BRANCH_CODES[this.branch];
          },
          message: "Branch does not match the registration number.",
        },
      ],
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

    // ---------------- Student Fields ----------------

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
      enum: {
        values: BRANCHES,
        message: "{VALUE} is not a valid branch.",
      },
      required: function () {
        return this.role === "Student";
      },
    },

    year: {
      type: String,
      enum: ["1st", "2nd", "3rd", "4th"],
      required: function () {
        return this.role === "Student";
      },
    },

    // ---------------- Supervisor Fields ----------------

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
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);