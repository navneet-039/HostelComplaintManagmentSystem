import { createContext, useEffect, useState, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

/* ================= ACCESS TOKEN IN MEMORY ================= */
let accessTokenMemory = null;

export const getStoredAccessToken = () => accessTokenMemory;
export const setStoredAccessToken = (token) => {
  accessTokenMemory = token;
};

/* ================= PROVIDER ================= */
export const AuthContextProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  /* ================= LOAD USER ================= */
  const loadUser = useCallback(async () => {
    try {
      const res = await api.get("/api/users/refresh-token");

      if (res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
        setStoredAccessToken(res.data.accessToken);

        if (res.data.user) {
          setUser(res.data.user);
        }
      } else {
        setAccessToken(null);
        setUser(null);
        setStoredAccessToken(null);
      }
    } catch (err) {
      setAccessToken(null);
      setUser(null);
      setStoredAccessToken(null);
    } finally {
      setLoading(false);
      setAuthReady(true);
    }
  }, []);

  /* ================= LOGOUT ================= */
  const logout = useCallback(async () => {
    try {
      await api.post("/api/users/logout");
    } catch (err) {
      console.error(err);
    } finally {
      setAccessToken(null);
      setUser(null);
      setStoredAccessToken(null);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        loading,
        authReady,
        setAccessToken,
        setUser,
        logout,
        reloadUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
