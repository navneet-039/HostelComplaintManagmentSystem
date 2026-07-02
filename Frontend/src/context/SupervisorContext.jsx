import { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import AuthContext from "./authContext";

export const SupervisorContext = createContext(null);

const SupervisorContextProvider = ({ children }) => {
  const { accessToken, user, loading } = useContext(AuthContext);

  const [complaints, setComplaints] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  const fetchSupervisorComplaints = useCallback(async () => {
    if (!accessToken || !user || user.role !== "Supervisor") return;

    setDataLoading(true);
    try {
      const { data } = await api.get("/api/supervisor/hostel/complaints");
      console.log("hii after api call");
      console.log(data);

      setComplaints(data.formattedComplaints || []);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load complaints"
      );
    } finally {
      setDataLoading(false);
    }
  }, [accessToken, user]);

  useEffect(() => {
    if (!loading && user?.role === "Supervisor") {
      fetchSupervisorComplaints();
    } else {
      setComplaints([]);
    }
  }, [loading, user, fetchSupervisorComplaints]);

  return (
    <SupervisorContext.Provider
      value={{ complaints, dataLoading, fetchSupervisorComplaints }}
    >
      {children}
    </SupervisorContext.Provider>
  );
};

export default SupervisorContextProvider;
