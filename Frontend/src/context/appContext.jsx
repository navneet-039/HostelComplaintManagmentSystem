import { createContext, useEffect, useState, useCallback, useContext } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import AuthContext from "./authContext";

export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
  const { accessToken, user, loading } = useContext(AuthContext);
  const [studentComplaints, setStudentComplaints] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  const fetchStudentComplaints = useCallback(async () => {
    if (!accessToken || !user) return;
    setDataLoading(true);
    try {
      const { data } = await api.get("/api/supervisor/student/complaints");
      setStudentComplaints(data.formattedComplaints || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch complaints");
    } finally {
      setDataLoading(false);
    }
  }, [accessToken, user]);

  useEffect(() => {
    if (!loading && accessToken && user) fetchStudentComplaints();
    else if (!accessToken || !user) setStudentComplaints([]);
  }, [loading, accessToken, user, fetchStudentComplaints]);

  return (
    <AppContext.Provider value={{ studentComplaints, dataLoading, fetchStudentComplaints }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
