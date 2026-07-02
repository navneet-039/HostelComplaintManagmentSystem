import React from "react";
import { MdEmail, MdPhone, MdLocationOn, MdSupportAgent } from "react-icons/md";
import Navbar from "../components/navbar"

export default function Contact() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-800">
              Contact Us
            </h1>
            <p className="mt-2 text-slate-600">
              Hostel Support &amp; Student Help Desk
            </p>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Contact info */}
            <div className="bg-white rounded-xl shadow-md border p-6 space-y-5">
              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                Get in Touch
              </h2>

              <div className="flex items-center gap-4">
                <MdEmail className="text-blue-600 text-2xl" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-slate-600">hostelsupport@college.edu</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <MdPhone className="text-blue-600 text-2xl" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-slate-600">+91 1111 2222 33</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <MdLocationOn className="text-blue-600 text-2xl" />
                <div>
                  <p className="font-medium">Office</p>
                  <p className="text-slate-600">
                    Hostel Office, National Institute of Technology  <br />
                    Adityapur ,Jamshedpur
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <MdSupportAgent className="text-blue-600 text-2xl" />
                <div>
                  <p className="font-medium">Office Hours</p>
                  <p className="text-slate-600">
                    Monday – Friday <br />
                    9:00 AM – 5:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Info box */}
            <div className="bg-white rounded-xl shadow-md border p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Need Help?
              </h2>

              <p className="text-slate-600 mb-4">
                For hostel-related issues such as electricity, water,
                cleaning, or furniture problems, please use the
                <span className="font-medium"> Complaint Registration </span>
                page.
              </p>

              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Track your complaints online</li>
                <li>Get faster issue resolution</li>
                <li>Receive status updates</li>
              </ul>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 Tip: Always mention your room number and hostel block
                  while submitting a complaint.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500 mt-10">
             {new Date().getFullYear()} National Institute of Technology  
                    Adityapur– Hostel Management System
          </p>
        </div>
      </div>
    </>
  );
}