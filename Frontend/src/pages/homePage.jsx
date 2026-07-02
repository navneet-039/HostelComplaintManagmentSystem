import React from "react";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-richblack-5 font-inter">
      <Navbar />

      <section className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center py-20">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-richblack-800 leading-tight">
              Simplify Hostel <br />
              <span className="text-blue-200">Complaint Management</span>
            </h1>

            <p className="mt-6 text-lg text-richblack-500 max-w-xl">
              HostelSync helps students easily register complaints and track
              their status while administrators manage and resolve them
              efficiently.
            </p>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate("/register-complaints")}
                className="px-6 py-3 rounded-xl bg-blue-200 text-white font-medium hover:bg-blue-300 transition"
              >
                Register Complaint
              </button>

              <button
                onClick={() => navigate("/all-complaints")}
                className="px-6 py-3 rounded-xl border border-blue-200 text-blue-200 font-medium hover:bg-blue-5 transition"
              >
                View Complaints
              </button>
            </div>
          </div>

          <div className="hidden md:flex justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-richblack-700 mb-4">
                Why HostelSync?
              </h3>

              <ul className="space-y-3 text-richblack-500">
                <li>✔ Easy complaint registration</li>
                <li>✔ Real-time status updates</li>
                <li>✔ Transparent resolution process</li>
                <li>✔ Mobile & desktop friendly</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-richblack-800 text-richblack-100">
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-white">
              HostelSync
            </h3>
            <p className="text-sm text-richblack-200">
              A smart hostel complaint management system designed to improve
              student experience and administration efficiency.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-richblack-200">
              <li className="hover:text-blue-200 cursor-pointer">Home</li>
              <li className="hover:text-blue-200 cursor-pointer">
                Register Complaints
              </li>
              <li className="hover:text-blue-200 cursor-pointer">
                All Complaints
              </li>
              <li className="hover:text-blue-200 cursor-pointer">Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-white">Contact</h4>
            <ul className="space-y-2 text-sm text-richblack-200">
              <li>Email: hostelsupport@college.edu</li>
              <li>Phone: +1111 2222 3333 4444</li>
              <li>Location: India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-richblack-700 text-center py-4 text-sm text-richblack-300">
          © {new Date().getFullYear()} HostelSync. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
