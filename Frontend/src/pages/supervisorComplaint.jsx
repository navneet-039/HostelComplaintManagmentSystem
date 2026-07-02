import React, { useContext, useState } from "react";
import { SupervisorContext } from "../context/SupervisorContext";
import Navbar from "../components/navbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const STATUSES = ["Pending", "In_progress", "Resolved"];

export default function SupervisorComplaint() {
  const {
    complaints = [],
    dataLoading,
    fetchSupervisorComplaints,
  } = useContext(SupervisorContext);

  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState(null);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);

      const res = await api.patch(`/api/complaints/status/${id}`, {
        status: newStatus,
      });

      if (res.data.success) {
        toast.success("Status updated");
        fetchSupervisorComplaints();
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-richblack-25 text-richblack-700";
      case "In_progress":
        return "bg-richblack-50 text-richblack-800";
      case "Resolved":
        return "bg-richblack-100 text-richblack-900";
      default:
        return "";
    }
  };

  if (dataLoading) {
    return (
      <p className="text-center mt-24 text-xl font-medium">
        Loading complaints...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-richblack-5">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-8">Hostel Complaints</h2>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Complaint ID</TableCell>
                <TableCell>Room</TableCell>
                <TableCell>Reg. Number</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {complaints.map((c) => (
                <TableRow key={c._id} hover>
                  <TableCell>
                    <span className="font-semibold text-blue-600">
                      {c.complaintId}
                    </span>
                  </TableCell>

                  <TableCell>{c.student?.roomNumber}</TableCell>

                  <TableCell>{c.student?.registrationNumber}</TableCell>

                  <TableCell>{c.description}</TableCell>

                  <TableCell>
                    {updatingId === c._id ? (
                      <CircularProgress size={22} />
                    ) : (
                      <FormControl size="small" sx={{ minWidth: 170 }}>
                        <Select
                          value={c.status}
                          onChange={(e) =>
                            handleUpdateStatus(c._id, e.target.value)
                          }
                          sx={{
                            borderRadius: "999px",
                            fontWeight: 600,
                            "& .MuiSelect-select": {
                              paddingY: "8px",
                            },
                            backgroundColor:
                              c.status === "Pending"
                                ? "#FEF3C7"
                                : c.status === "In_progress"
                                  ? "#DBEAFE"
                                  : "#DCFCE7",
                            color:
                              c.status === "Pending"
                                ? "#92400E"
                                : c.status === "In_progress"
                                  ? "#1D4ED8"
                                  : "#166534",
                          }}
                        >
                          {STATUSES.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status.replace("_", " ")}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </TableCell>

                  <TableCell>
                    <button
                      onClick={() =>
                        navigate(`/supervisor/complaints/${c._id}`)
                      }
                      className="text-blue-600 underline"
                    >
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
