import { Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext";
import AppContextProvider from "./context/appContext";

import ProtectedRoute from "./components/protectedRoute";
import RoleBasedHome from "./pages/rolebasedHomepage";
import Login from "./pages/login";
import Contact from "./pages/contact";

import StudentRegisteredComplaint from "./pages/StudentRegisteredComplaint";
import RegisterComplaint from "./pages/regsiterComplaint";
import ChangePassword from "./pages/changepass";

import SupervisorContextProvider from "./context/SupervisorContext";
import SupervisorComplaint from "./pages/supervisorComplaint";
import RegisterStudent from "./pages/registerStudent";
import SupervisorStudents from "./pages/AllStudents";
import PublishNotice from "./pages/PublishNotice";
import NoticeBoard from "./pages/NoticeBoard";
import SupervisorComplaintDetail from "./pages/supervisorComplaintdetail";

function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<RoleBasedHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reset-password" element={<ChangePassword />} />

        <Route
          path="/all-complaints"
          element={
            <ProtectedRoute roles={["Student"]}>
              <AppContextProvider>
                <StudentRegisteredComplaint />
              </AppContextProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/register-complaints"
          element={
            <ProtectedRoute roles={["Student"]}>
              <AppContextProvider>
                <RegisterComplaint />
              </AppContextProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute roles={["Student"]}>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/supervisor"
          element={
            <ProtectedRoute roles={["Supervisor"]}>
              <SupervisorContextProvider>
                <SupervisorComplaint />
              </SupervisorContextProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/register-student"
          element={
            <ProtectedRoute roles={["Supervisor"]}>
              <RegisterStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supervisor/students"
          element={
            <ProtectedRoute roles={["Supervisor"]}>
              <SupervisorContextProvider>
                <SupervisorStudents />
              </SupervisorContextProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/supervisor/complaints/:complaintId"
          element={
            <ProtectedRoute roles={["Supervisor"]}>
              <SupervisorContextProvider>
                <SupervisorComplaintDetail />
              </SupervisorContextProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/publishNotice"
          element={
            <ProtectedRoute roles={["Supervisor"]}>
              <SupervisorContextProvider>
                <PublishNotice />
              </SupervisorContextProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/checknotice"
          element={
            <ProtectedRoute roles={["Student", "Supervisor"]}>
              <NoticeBoard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
