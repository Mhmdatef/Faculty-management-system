import React from "react";
import { useNavigate } from "react-router-dom";

const AffairDashboard: React.FC = () => {
    const navigate = useNavigate();
    
    const dashboardItems = [
        {
            id: "manage-students",
            title: "Manage Students",
            description: "Add, edit, and manage student records",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197v1M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            gradient: "from-blue-500 to-blue-600",
            hoverGradient: "hover:from-blue-600 hover:to-blue-700",
            route: "/auth/affair-dashboard/manage-students"
        },
        {
            id: "manage-departments",
            title: "Manage Departments",
            description: "Organize and oversee departments",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            gradient: "from-green-500 to-emerald-600",
            hoverGradient: "hover:from-green-600 hover:to-emerald-700",
            route: "/auth/affair-dashboard/manage-departments"
        },
        {
            id: "manage-courses",
            title: "Manage Courses",
            description: "Create and manage course offerings",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            gradient: "from-purple-500 to-indigo-600",
            hoverGradient: "hover:from-purple-600 hover:to-indigo-700",
            route: "/auth/affair-dashboard/manage-courses"
        }
    ];

    const handleCardClick = (route: string) => {
        navigate(route);
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={handleBackClick}
                        className="group flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-medium">Back</span>
                    </button>
                    
                    <div className="text-center flex-1">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                            Affairs Dashboard
                        </h1>
                        <p className="text-gray-600 text-lg">Manage your academic operations efficiently</p>
                    </div>
                    
                    <div className="w-20"></div> {/* Spacer for balance */}
                </div>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {dashboardItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleCardClick(item.route)}
                            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} ${item.hoverGradient} shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer`}
                        >
                            {/* Decorative background pattern */}
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                            
                            {/* Card content */}
                            <div className="relative p-8 text-white">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-300">
                                        {item.icon}
                                    </div>
                                    <svg className="w-6 h-6 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                                
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-white/90 transition-colors duration-300">
                                    {item.title}
                                </h3>
                                <p className="text-white/80 text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                                    {item.description}
                                </p>
                                
                                {/* Hover indicator */}
                                <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Stats or Additional Info */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full text-gray-700 shadow-sm">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">System Status: All services operational</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AffairDashboard;