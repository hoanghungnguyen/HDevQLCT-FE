import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { LogOut, Wallet, Sun, Moon } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-[#1E1E2D] shadow dark:shadow-none border-b border-transparent dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="shrink-0 flex items-center">
              <Link
                to="/"
                className="flex items-center gap-2 text-indigo-600 dark:text-[#69ADFF] font-bold text-xl"
              >
                <Wallet className="h-6 w-6" /> QLCT App
              </Link>
            </div>

            {/* Navigation Links */}
            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="text-gray-900 border-indigo-500 hover:text-indigo-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Tổng quan
                </Link>
                <Link
                  to="/transactions"
                  className="text-gray-500 border-transparent hover:text-indigo-600 inline-flex items-center px-1 pt-1 border-b-2 hover:border-indigo-300 text-sm font-medium transition-colors"
                >
                  Biến động số dư
                </Link>
              </div>
            )}
          </div>

          {/* Right side (Theme + Logout) */}
          <div className="flex items-center space-x-2">
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors"
            >
                {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-indigo-400" />}
            </button>

            {isAuthenticated ? (
                <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-transparent hover:text-red-600 dark:hover:text-red-400 focus:outline-none transition-colors"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                </button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-indigo-600 font-medium text-sm"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-indigo-700 transition"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
