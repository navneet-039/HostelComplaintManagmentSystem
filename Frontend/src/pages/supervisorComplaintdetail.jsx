import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/navbar";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function SupervisorComplaintDetail() {
  const { complaintId } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await api.get(
          `/api/supervisor/complaints/${complaintId}`
        );
        setComplaint(res.data.complaint);
      } catch (err) {
        console.error("Error fetching complaint:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [complaintId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-richblack-5">
        <CircularProgress />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-richblack-5">
        <Navbar />
        <p className="text-center mt-24 text-lg font-medium text-richblack-700">
          Complaint not found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-richblack-5 font-inter">
      <Navbar />

      <div className="max-w-maxContent mx-auto px-6 py-10">
        {/* ---------- HEADER ---------- */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
              bg-white shadow hover:bg-richblack-25 transition"
          >
            <ArrowBackIcon fontSize="small" />
            <span className="font-medium text-richblack-700">Back</span>
          </button>

          <h2 className="text-3xl font-bold text-richblack-900">
            Complaint Details
          </h2>
        </div>

        {/* ---------- CARD ---------- */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* ---------- TOP INFO ---------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b border-richblack-50">
            <Info label="Student Name" value={complaint.student?.name} />
            <Info label="Student Email" value={complaint.student?.email} />
            <Info label="Hostel" value={complaint.hostel?.name} />

            <div>
              <p className="text-sm font-semibold text-richblack-500 mb-1">
                Status
              </p>
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold
                  ${
                    complaint.status === "Pending"
                      ? "bg-yellow-50 text-yellow-500"
                      : complaint.status === "In_progress"
                      ? "bg-blue-50 text-blue-400"
                      : "bg-caribbeangreen-50 text-caribbeangreen-600"
                  }`}
              >
                {complaint.status}
              </span>
            </div>
          </div>

          {/* ---------- DESCRIPTION ---------- */}
          <div className="p-6 border-b border-richblack-50">
            <p className="text-sm font-semibold text-richblack-500 mb-2">
              Description
            </p>
            <p className="text-richblack-700 leading-relaxed">
              {complaint.description}
            </p>
          </div>

          {/* ---------- IMAGES ---------- */}
          {complaint.images?.length > 0 && (
            <div className="p-6">
              <p className="text-sm font-semibold text-richblack-500 mb-4">
                Attached Images
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {complaint.images.map((img) => (
                  <div
                    key={img.key}
                    className="overflow-hidden rounded-xl border border-richblack-100 hover:shadow-lg transition"
                  >
                    <img
                      src={img.url}
                      alt="Complaint"
                      className="w-full h-72 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- SMALL INFO BLOCK ----------
const Info = ({ label, value }) => (
  <div>
    <p className="text-sm font-semibold text-richblack-500 mb-1">
      {label}
    </p>
    <p className="text-richblack-800 font-medium">{value || "—"}</p>
  </div>
);
