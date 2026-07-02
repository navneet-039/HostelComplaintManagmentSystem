import React, { useContext } from "react";
import { AppContext } from "../context/appContext";
import Navbar from "../components/navbar";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";

export default function StudentRegisteredComplaint() {
  const { studentComplaints, dataLoading } = useContext(AppContext);

  if (dataLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
          <CircularProgress />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">My Complaints</h1>
            <p className="text-slate-500 mt-2">
              View and monitor all your registered hostel complaints in one
              place.
            </p>
          </div>

          <div className="mt-5 md:mt-0 bg-white shadow rounded-xl px-6 py-4 border">
            <p className="text-sm text-gray-500">Total Complaints</p>
            <h2 className="text-3xl font-bold text-blue-600">
              {studentComplaints.length}
            </h2>
          </div>
        </div>

        {studentComplaints.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <h3 className="text-2xl font-semibold text-gray-700">
              No Complaints Found
            </h3>

            <p className="text-gray-500 mt-3">
              You haven't registered any complaints yet.
            </p>
          </div>
        ) : (
          <Paper className="rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-5 border-b bg-white">
              <h2 className="text-xl font-semibold text-slate-800">
                Complaint History
              </h2>
            </div>

            <TableContainer>
              <Table sx={{ minWidth: 1200 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#2563eb",
                    }}
                  >
                    <TableCell sx={headCell}>Complaint ID</TableCell>
                    <TableCell sx={headCell}>Title</TableCell>
                    <TableCell sx={headCell}>Description</TableCell>
                    <TableCell sx={headCell}>Category</TableCell>
                    <TableCell sx={headCell}>Registered On</TableCell>
                    <TableCell sx={headCell}>Status</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {studentComplaints.map((complaint, index) => (
                    <TableRow
                      key={complaint._id}
                      hover
                      sx={{
                        backgroundColor:
                          index % 2 === 0 ? "#ffffff" : "#f8fafc",
                      }}
                    >
                      {/* Complaint ID */}
                      <TableCell sx={bodyCell}>
                        <span className="font-semibold text-blue-700">
                          {complaint.complaintId}
                        </span>
                      </TableCell>

                      {/* Title */}
                      <TableCell sx={bodyCell}>
                        <span className="font-semibold">{complaint.title}</span>
                      </TableCell>

                      {/* Description */}
                      <TableCell
                        sx={{
                          ...bodyCell,
                          maxWidth: "320px",
                        }}
                      >
                        <TableCell
                          sx={{
                            ...bodyCell,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            maxWidth: "450px",
                          }}
                        >
                          {complaint.description}
                        </TableCell>
                      </TableCell>

                      {/* Category */}
                      <TableCell sx={bodyCell}>{complaint.category}</TableCell>

                      {/* Registered Date */}
                      <TableCell sx={bodyCell}>
                        {new Date(complaint.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>

                      {/* Status */}
                      <TableCell sx={bodyCell}>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                            complaint.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : complaint.status === "In_progress"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {complaint.status.replace("_", " ")}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </div>
    </div>
  );
}

const headCell = {
  color: "#fff",
  fontWeight: 700,
  fontSize: "1rem",
};

const bodyCell = {
  fontSize: "0.95rem",
  color: "#334155",
  paddingTop: "18px",
  paddingBottom: "18px",
};
