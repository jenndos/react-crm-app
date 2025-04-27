import { Outlet, Navigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const ProtectedRoutes = () => {
  const [userValidated, setUserValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const isAuthenticated = true;

  useEffect(() => {
    const checkUserExists = async () => {
      const params = new URLSearchParams(location.search);
      const userId = params.get("user_id");

      if (!userId) {
        setUserValidated(true);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/users/${userId}`
        );
        if (!response.ok) {
          throw new Error("User check failed");
        }
        const data = await response.json();
        setUserValidated(data.success);
      } catch (error) {
        console.error("User validation error:", error);
        setUserValidated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserExists();
  }, [location.search]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!userValidated) {
    return <Navigate to="/notfound" replace />;
  }

  return (
    <>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto bg-gray-100 relative">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default ProtectedRoutes;
