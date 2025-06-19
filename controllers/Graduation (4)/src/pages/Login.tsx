import { useState } from "react";
import { User, Lock, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/studentServices";
import { removeToken } from "../utils/removeToken";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const userType = sessionStorage.getItem("loginType");
    if (userType == "Student") {
      loginUser("student", { email, pass }, (studentData) => {
        navigate("/auth/student-dashboard", { state: studentData });
        setIsLoading(false);
      });
    } else if (userType == "Affair") {
      loginUser("affairs", { email, pass }, () => {
        navigate("/auth/affair-dashboard");
        setIsLoading(false);
      });
    } else if (userType == "Activity Staff") {
      loginUser("activity_staff", { email, pass }, () => {
        navigate("/auth/activity-staff");
        setIsLoading(false);
      });
    } else if (userType == "Control") {
      loginUser("control", { email, pass }, () => {
        navigate("/auth/student-control");
        setIsLoading(false);
      });
    }
        setIsLoading(false);
  };

  removeToken();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-md transform transition-all duration-700 ease-out animate-fade-in-up">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6 relative overflow-hidden">
          {/* Subtle background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
          
          <div className="relative z-10 text-center">
            {/* Logo/Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mb-4 shadow-lg transform transition-all duration-300 hover:scale-110">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            
            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Portal</h1>
            <p className="text-gray-600 text-sm">Welcome back! Please sign in to continue</p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative overflow-hidden">
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -skew-x-12 animate-shimmer"></div>
          
          <div className="relative z-10">
            {/* User Type Badge */}
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              {sessionStorage.getItem("loginType")} Login
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className={`
                  relative flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3
                  transition-all duration-300 ease-out
                  ${focusedInput === 'email' 
                    ? 'bg-blue-50 border-blue-300 shadow-md ring-4 ring-blue-100' 
                    : 'hover:bg-gray-100 hover:border-gray-300'
                  }
                `}>
                  <User className={`
                    w-5 h-5 mr-3 transition-all duration-300
                    ${focusedInput === 'email' ? 'text-blue-500' : 'text-gray-400'}
                  `} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Enter your email"
                    className="w-full bg-transparent text-gray-900 placeholder-gray-500 outline-none"
                    required
                  />
                </div>
                {/* Animated underline */}
                <div className={`
                  absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300
                  ${focusedInput === 'email' ? 'w-full' : 'w-0'}
                `}></div>
              </div>

              {/* Password Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className={`
                  relative flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3
                  transition-all duration-300 ease-out
                  ${focusedInput === 'password' 
                    ? 'bg-blue-50 border-blue-300 shadow-md ring-4 ring-blue-100' 
                    : 'hover:bg-gray-100 hover:border-gray-300'
                  }
                `}>
                  <Lock className={`
                    w-5 h-5 mr-3 transition-all duration-300
                    ${focusedInput === 'password' ? 'text-blue-500' : 'text-gray-400'}
                  `} />
                  <input
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-gray-900 placeholder-gray-500 outline-none"
                    required
                  />
                </div>
                {/* Animated underline */}
                <div className={`
                  absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300
                  ${focusedInput === 'password' ? 'w-full' : 'w-0'}
                `}></div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  relative w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl
                  font-medium transition-all duration-300 ease-out overflow-hidden
                  hover:from-blue-600 hover:to-purple-600 hover:shadow-lg hover:scale-[1.02]
                  focus:outline-none focus:ring-4 focus:ring-blue-200
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  group
                `}
              >
                {/* Button Content */}
                <span className={`
                  relative z-20 flex items-center justify-center transition-all duration-300
                  ${isLoading ? 'opacity-0' : 'opacity-100'}
                `}>
                  Sign In
                </span>
                
                {/* Loading Spinner */}
                <div className={`
                  absolute inset-0 flex items-center justify-center transition-all duration-300
                  ${isLoading ? 'opacity-100' : 'opacity-0'}
                `}>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"></div>
                
                {/* Click Ripple Effect */}
                <div className="absolute inset-0 bg-white/20 scale-0 group-active:scale-100 transition-transform duration-200 rounded-xl"></div>
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Need help? <span className="text-blue-500 hover:text-blue-600 cursor-pointer font-medium">Contact Support</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;