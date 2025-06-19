import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { removeToken } from "../utils/removeToken";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleClick = (type) => {
    sessionStorage.setItem("loginType", type);
    navigate("/login");
  };

  // Remove token as in original code
  removeToken();

  const userTypes = [
    { 
      id: 'student', 
      label: 'Student', 
      icon: '👨‍🎓', 
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      shadowColor: 'hover:shadow-blue-500/25'
    },
    { 
      id: 'control', 
      label: 'Control', 
      icon: '⚙️', 
      bgColor: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      shadowColor: 'hover:shadow-purple-500/25'
    },
    { 
      id: 'affair', 
      label: 'Affair', 
      icon: '📋', 
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      shadowColor: 'hover:shadow-green-500/25'
    },
    { 
      id: 'activity', 
      label: 'Activity Staff', 
      icon: '🎯', 
      bgColor: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      shadowColor: 'hover:shadow-orange-500/25'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Header Section */}
        <div className={`text-center mb-12 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Logo/Icon */}
          <div className="w-28 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
            <span className="text-3xl text-white font-bold">BFCAI</span>
          </div>
          
          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4 tracking-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              BFCAI
            </span>{' '}
            System
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 font-medium mb-2">
            Login as
          </p>
          
          {/* Decorative Line */}
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Login Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full mb-8">
          {userTypes.map((type, index) => (
            <div
              key={type.id}
              className={`transform transition-all duration-700 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <button
                onClick={() => handleClick(type.label)}
                onMouseEnter={() => setHoveredButton(type.id)}
                onMouseLeave={() => setHoveredButton(null)}
                className={`group relative w-full p-6 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-2xl ${type.shadowColor} transition-all duration-300 hover:scale-105 hover:-translate-y-1`}
              >
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 rounded-2xl ${type.bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Icon Circle */}
                <div className={`relative w-16 h-16 ${type.bgColor} rounded-xl flex items-center justify-center mb-4 mx-auto shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110`}>
                  <span className="text-2xl text-white">{type.icon}</span>
                </div>
                
                {/* Label */}
                <div className="relative">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors duration-300">
                    {type.label}
                  </h3>
                  
                  {/* Animated Underline */}
                  <div className={`h-0.5 ${type.bgColor} w-0 group-hover:w-full transition-all duration-500 mx-auto rounded-full`}></div>
                </div>

                {/* Hover Effect Border */}
                <div className={`absolute inset-0 rounded-2xl border-2 ${type.bgColor.replace('bg-', 'border-')} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className={`text-center transform transition-all duration-1000 delay-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center justify-center space-x-3 text-gray-500 mb-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
            <span className="text-sm font-medium">Secure Educational Portal</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">System Online</span>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default WelcomePage;