import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/navbar";
import api from "../api/axios";
import toast from "react-hot-toast";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

export default function SupervisorStudents() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  // Fetch all students from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/supervisor/Allstudent");

      if (res.data.success) {
        setStudents(res.data.students);
        setFilteredStudents(res.data.students);
      }
    } catch (error) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Initialize search term from URL
  useEffect(() => {
    const term = searchParams.get("search") || "";
    setSearchTerm(term);
  }, [searchParams]);

  // Filter students whenever searchTerm changes
  useEffect(() => {
    const filtered = students.filter((student) => {
      const term = searchTerm.toLowerCase();
      return (
        student.name.toLowerCase().includes(term) ||
        student.registrationNumber.toLowerCase().includes(term) ||
        student.roomNumber.toLowerCase().includes(term)
      );
    });
    setFilteredStudents(filtered);

    // Update URL for sharing
    if (searchTerm) {
      setSearchParams({ search: searchTerm });
    } else {
      setSearchParams({});
    }
  }, [searchTerm, students, setSearchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-richblack-5">
      <Navbar />

      {/* Centered card layout */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <Paper className="p-6 rounded-2xl shadow-lg bg-white">
          <h2 className="text-2xl font-bold mb-4 text-richblack-900">
            Hostel Students
          </h2>

          {/* Search Box */}
          <div className="mb-6 flex justify-end">
            <TextField
              label="Search Students"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              placeholder="Type name, reg no, or room no..."
              helperText="Searchable by Name, Registration Number, or Room Number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: "350px" }}
            />
          </div>

          {filteredStudents.length === 0 ? (
            <p className="text-richblack-600 font-medium text-center">
              No students found
            </p>
          ) : (
            <TableContainer
              component={Paper}
              className="rounded-2xl shadow overflow-x-auto"
            >
              <Table sx={{ minWidth: 1000 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#ECF5FF" }}>
                    <TableCell sx={headCell}>Name</TableCell>
                    <TableCell sx={headCell}>Email</TableCell>
                    <TableCell sx={headCell}>Phone</TableCell>
                    <TableCell sx={headCell}>Reg. No</TableCell>
                    <TableCell sx={headCell}>Room</TableCell>
                    <TableCell sx={headCell}>Floor</TableCell>
                    <TableCell sx={headCell}>Branch</TableCell>
                    <TableCell sx={headCell}>Year</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow
                      key={student._id}
                      hover
                      sx={{ transition: "background-color 0.2s" }}
                    >
                      <TableCell sx={bodyCell}>{student.name}</TableCell>
                      <TableCell sx={bodyCell}>{student.email}</TableCell>
                      <TableCell sx={bodyCell}>{student.phone}</TableCell>
                      <TableCell sx={bodyCell}>
                        {student.registrationNumber}
                      </TableCell>
                      <TableCell sx={bodyCell}>{student.roomNumber}</TableCell>
                      <TableCell sx={bodyCell}>{student.floor || "-"}</TableCell>
                      <TableCell sx={bodyCell}>{student.branch}</TableCell>
                      <TableCell sx={bodyCell}>{student.year}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </div>
    </div>
  );
}

const headCell = {
  fontSize: "0.95rem",
  fontWeight: 700,
  color: "#073B4C",
};

const bodyCell = {
  fontSize: "0.9rem",
  fontWeight: 500,
  color: "#2C333F",
};
