import React, { useEffect, useState } from "react";
import IconBell from "../assets/navbar/icon-bell.png";
import { useNavigate, useSearchParams } from "react-router-dom";

interface User {
  id: number;
  name: string;
  surname: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/${userId}`
        );
        const data = await response.json();

        if (data.success) {
          setUser(data.user);
        } else {
          console.error("Error fetching user:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUserData();
  }, []);

  const getInitials = (name: string, surname: string) => {
    const firstInitial = name ? name.charAt(0) : "";
    const secondInitial = surname ? surname.charAt(0) : "";
    return `${firstInitial}${secondInitial}`.toUpperCase();
  };

  return (
    <div className="w-full h-16 bg-white shadow-sm">
      <div className="w-4/5 h-full mx-auto flex items-center justify-between">
        <div className="flex-1"></div>

        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={IconBell}
              alt="Notifications"
              className="w-6 h-6 cursor-pointer hover:opacity-80"
            />
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center space-x-4">
            {/* User avatar */}
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {user ? getInitials(user.name, user.surname) : ""}
            </div>
            <div className="text-right">
              <h3 className="text-sm font-semibold text-gray-800 text-left">
                {user ? user.name : ""}
              </h3>
              <p className="text-xs text-gray-500 text-left">Админ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
