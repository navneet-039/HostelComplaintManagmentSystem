import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import Navbar from "../components/navbar";

const BRANCHES = ["CSE", "ECE", "EEE", "CE", "ME", "IT"];

const BRANCH_CODES = {
  CSE: "CS",
  ECE: "EC",
  EEE: "EE",
  CE: "CE",
  ME: "ME",
  IT: "IT",
};

const YEARS = ["1st", "2nd", "3rd", "4th"];

export default function RegisterStudent() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    registrationNumber: "",
    password: "",
    branch: "",
    year: "",
    roomNumber: "",
    floor: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "registrationNumber") {
      value = value.toUpperCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const branchCode = BRANCH_CODES[formData.branch];

    const regex = /^\d{4}(UG|PG)[A-Z]{2,4}\d{3}$/;

    if (!regex.test(formData.registrationNumber)) {
      toast.error(
        "Registration number should be in the format YYYYUG/PG<BranchCode>XXX.",
      );
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/users/register", formData, {
        withCredentials: true,
      });

      toast.success(res.data.message || "Student registered successfully");

      setFormData({
        name: "",
        email: "",
        phone: "",
        registrationNumber: "",
        password: "",
        branch: "",
        year: "",
        roomNumber: "",
        floor: "",
      });

      navigate("/supervisor");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-richblack-5 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-richblack-900">
              Student Registration
            </h2>

            <p className="text-sm text-richblack-500 mt-1">
              Enter student details carefully
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name + Registration Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                label="Student Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />

              <FormField
                label="Registration Number"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="Example: 2024UGEC001"
              />
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />

              <FormField
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Branch + Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SelectField
                label="Branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                options={BRANCHES}
              />

              <SelectField
                label="Year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                options={YEARS}
              />
            </div>

            {/* Room + Floor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                label="Room Number"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
              />

              <FormField
                label="Floor"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <FormField
              label="Temporary Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-richblue-500 text-white py-3 rounded-lg font-semibold hover:bg-richblue-600 disabled:opacity-60 transition"
            >
              {loading ? "Registering..." : "Register Student"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

function FormField({ label, type = "text", ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-richblack-700 mb-1">
        {label}
      </label>

      <input
        type={type}
        required
        {...props}
        className="w-full border border-richblack-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-richblue-500 focus:border-transparent transition"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-richblack-700 mb-1">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full border border-richblack-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-richblue-500 focus:border-transparent transition"
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
