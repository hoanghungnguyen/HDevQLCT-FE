import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Wallet } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="shrink-0 flex items-center">
              <Link
                to="/"
                className="flex items-center gap-2 text-indigo-600 font-bold text-xl"
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

          {/* Right side (Logout) */}
          {isAuthenticated ? (
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-red-600 focus:outline-none transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </button>
            </div>
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
    </nav>
  );
};

export default Navbar;
