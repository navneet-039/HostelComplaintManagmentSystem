import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AppContext } from "../context/appContext";
import { FiAlertCircle } from "react-icons/fi";
import {
  MdElectricalServices,
  MdWaterDrop,
  MdChair,
  MdCleaningServices,
} from "react-icons/md";

import api from "../api/axios";
import Navbar from "../components/navbar";

export default function RegisterComplaint() {
  const navigate = useNavigate();
  const {fetchStudentComplaints}=useContext(AppContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });

  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    { label: "Electricity", icon: <MdElectricalServices /> },
    { label: "Water", icon: <MdWaterDrop /> },
    { label: "Furniture", icon: <MdChair /> },
    { label: "Cleaning", icon: <MdCleaningServices /> },
    { label: "Other", icon: <FiAlertCircle /> },
  ];

  /* ================= IMAGE HANDLERS ================= */

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);

      images.forEach((img) => {
        formDataToSend.append("images", img);
      });

      const res = await api.post(
        "/api/complaints/register",
        formDataToSend,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(res.data.message || "Complaint registered successfully");
        await fetchStudentComplaints();
      navigate("/all-complaints");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to register complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-richblue-5 to-pure-greys-5 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-pure-greys-25 shadow-md">
            {/* Header */}
            <div className="px-6 py-5 border-b border-pure-greys-25">
              <h1 className="text-2xl font-semibold text-richblue-400">
                Hostel Complaint Registration
              </h1>
              <p className="text-sm text-pure-greys-400 mt-1">
                Submit hostel issues for quick resolution
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Complaint Title
                </label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border text-sm"
                
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border text-sm"
                  placeholder="Explain the issue clearly..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Category
                </label>

                <div className="grid grid-cols-2 gap-4">
                  {categories.map((item) => (
                    <button
                      type="button"
                      key={item.label}
                      onClick={() =>
                        setFormData({ ...formData, category: item.label })
                      }
                      className={`flex items-center gap-3 px-4 py-3 border text-sm
                        ${
                          formData.category === item.label
                            ? "border-richblue-300 bg-richblue-5"
                            : "border-pure-greys-50"
                        }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Complaint Images (optional)
                </label>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 border border-richblue-300 text-richblue-400 text-sm"
                >
                  Add Images ({images.length}/5)
                </button>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 font-semibold
                    ${
                      loading
                        ? "bg-gray-300"
                        : "bg-richblue-400 text-white"
                    }`}
                >
                  {loading ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ================= IMAGE MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Upload Images</h2>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="mb-4"
            />

            <div className="grid grid-cols-3 gap-3 mb-4">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="h-20 w-20 object-cover border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-richblue-400 text-white"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
