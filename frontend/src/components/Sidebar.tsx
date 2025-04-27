import React, { useState } from "react";
import {
  FiCalendar,
  FiCamera,
  FiFileText,
  FiLogOut,
  FiSettings,
  FiLayers,
  FiSun,
  FiUser,
  FiUsers,
  FiMoon,
} from "react-icons/fi";
import { BiSolidGridAlt } from "react-icons/bi";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import { TbMenu3 } from "react-icons/tb";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const [isDark, setIsDark] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const navItems = [
    { icon: BiSolidGridAlt, text: "Главная", path: "main" },
    { icon: FiFileText, text: "Задачи", path: "tasks" },
    { icon: FiLayers, text: "Проекты", path: "projects" },
    { icon: FiCamera, text: "Приглашения", path: "invitations" },
    { icon: FiCalendar, text: "Календарь", path: "calendar" },
    { icon: FiUsers, text: "Участники", path: "participants" },
    { icon: FiUser, text: "Профиль", path: "profile" },
  ];

  const bottomItems = [
    { icon: FiSettings, text: "Настройки", path: "settings" },
    {
      icon: FiLogOut,
      text: "Выход из системы",
      path: "logout",
      onClick: () => console.log("Logging out..."),
    },
    null,
  ];

  return (
    <div
      className={`h-full bg-white shadow-lg transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex h-full flex-col">
        <button
          onClick={toggleSidebar}
          className="flex h-16 items-center justify-center hover:bg-gray-100"
        >
          <TbMenu3 size={24} />
        </button>

        <nav className="flex-1 overflow-y-auto">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={`/${item.path}?user_id=${userId}`}
              className={({ isActive }) => `
                flex w-full items-center hover:bg-gray-100 py-3 border-l-4
                ${isCollapsed ? "justify-center" : ""}
                ${isActive ? "border-sky-600 bg-sky-50" : "border-transparent"}
              `}
            >
              {({ isActive }) => (
                <div
                  className={`flex items-center ${
                    isCollapsed ? "w-20 justify-center" : "w-64 pl-5"
                  }`}
                >
                  <div
                    className={`w-6 h-6 flex items-center justify-center ${
                      isActive ? "text-sky-600" : "text-gray-600"
                    }`}
                  >
                    <item.icon size={24} />
                  </div>
                  {!isCollapsed && (
                    <span className="ml-4 text-sm font-medium whitespace-nowrap">
                      {item.text}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mb-14">
          {bottomItems.map((item, index) =>
            item === null ? (
              <div key={`space-${index}`} className="h-28" />
            ) : item?.path ? (
              <NavLink
                key={index}
                to={`/${item.path}?user_id=${userId}`}
                className={({ isActive }) => `
                  flex w-full items-center hover:bg-gray-100 py-3 border-l-4
                  ${isCollapsed ? "justify-center" : ""}
                  ${
                    isActive ? "border-sky-600 bg-sky-50" : "border-transparent"
                  }
                `}
              >
                {({ isActive }) => (
                  <div
                    className={`flex items-center ${
                      isCollapsed ? "w-20 justify-center" : "w-64 pl-5"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 flex items-center justify-center ${
                        isActive ? "text-sky-600" : "text-gray-600"
                      }`}
                    >
                      <item.icon size={24} />
                    </div>
                    {!isCollapsed && (
                      <span className="ml-4 text-sm font-medium whitespace-nowrap">
                        {item.text}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            ) : null
          )}

          <div className={`flex justify-center`}>
            <button
              onClick={toggleTheme}
              className={`relative w-14 h-7 rounded-full p-1 transition-colors border border-gray-200 duration-300 focus:outline-none border-1
              `}
              aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            >
              <div
                className={`absolute top-1/2 left-1 w-5 h-5 rounded-full shadow-md transform -translate-y-1/2 transition-transform duration-300 flex items-center justify-center ${
                  isDark ? "translate-x-7" : "translate-x-0"
                }`}
              >
                <span
                  className={`text-xs leading-none flex items-center justify-center
                  `}
                >
                  {isDark ? <FiMoon size={14} /> : <FiSun size={14} />}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
