import React, { useContext, useEffect } from "react";
import AuthContext from "../context/authContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiClipboard, FiUsers, FiUserPlus } from "react-icons/fi";
import Navbar from "../components/navbar";

export default function SupervisorHomePage() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Protect supervisor home
  useEffect(() => {
    if (!loading && user?.role !== "Supervisor") {
      toast.error("Unauthorized access");
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <p className="text-center mt-20 text-lg">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-richblack-5 font-inter">
      {/* NAVBAR */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-richblack-800">
            Supervisor Dashboard
          </h1>
          <p className="text-richblack-500 mt-2">
            Manage students and hostel complaints efficiently
          </p>
        </div>

        {/* DASHBOARD CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* VIEW COMPLAINTS */}
          <DashboardCard
            icon={<FiClipboard size={34} />}
            title="Student Complaints"
            description="View and update complaint status"
            onClick={() => navigate("/supervisor")}
          />

          {/* REGISTER STUDENT */}
          <DashboardCard
            icon={<FiUserPlus size={34} />}
            title="Register Student"
            description="Add new students and assign rooms"
            onClick={() => navigate("/register-student")}
          />

          {/* VIEW STUDENTS */}
          <DashboardCard
            icon={<FiUsers size={34} />}
            title="All Students"
            description="View all registered students"
            onClick={() => navigate("/supervisor/students")}
          />
        </div>

        {/* INFO SECTION */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow text-center">
          <h2 className="text-2xl font-semibold text-richblack-800 mb-2">
            Supervisor Responsibilities
          </h2>
          <p className="text-richblack-500 max-w-2xl mx-auto">
            As a supervisor, you are responsible for managing students,
            monitoring hostel complaints, and ensuring issues are resolved
            efficiently. Students cannot resolve complaints themselves.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- DASHBOARD CARD ---------- */

function DashboardCard({ icon, title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-2xl shadow hover:shadow-lg transition p-8 text-center"
    >
      <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center bg-richblack-700 text-white">
        {icon}
      </div>

      <h3 className="text-xl font-semibold text-richblack-800">{title}</h3>

      <p className="text-richblack-500 mt-2">{description}</p>
    </div>
  );
}
