import axios from "axios";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiUrl } from "./blog/Register";
import { useTheme } from "../context/ThemeContext";

const ResetPassword = () => {
 const [password, setPassword] = useState("");
 const [message, setMessage] = useState("");
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [searchParams] = useSearchParams();
 const token = searchParams.get("token");
 const { colors, darkMode: isDark } = useTheme();

 const handleReset = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  try {
   await axios.post(`${apiUrl}/api/auth/reset-password`, {
    token,
    newPassword: password,
   });
   setMessage("Password reset successfully");
  } catch (err) {
   setError(err.response?.data?.error || "Something went wrong");
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="flex items-center justify-center min-h-screen">
   <div
    className="p-8 rounded-lg shadow-md w-full max-w-xl"
    style={{
     backgroundColor: isDark
      ? colors.dark.secondaryBackground
      : colors.light.secondaryBackground,
    }}
   >
    <h2
     className="text-2xl font-bold mb-2 text-center"
     style={{
      color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
     }}
    >
     Reset Password
    </h2>
    <input
     type="password"
     value={password}
     onChange={(e) => setPassword(e.target.value)}
     placeholder="New Password"
     className="w-full rounded py-2 px-4 mb-4"
     style={{
      backgroundColor: isDark
       ? colors.dark.primaryBackground
       : colors.light.primaryBackground,
      color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
     }}
    />
    <button
     onClick={handleReset}
     disabled={loading}
     className="w-full text-white py-2 px-4 rounded-lg transition duration-200"
     style={{
      backgroundColor: isDark
       ? colors.dark.primaryBtn
       : colors.light.primaryBtn,
     }}
    >
     {loading ? "Resetting..." : "Submit"}
    </button>
    {message && (
     <p className="my-2 text-green-500 text-center mt-4">{message}</p>
    )}
    {error && <p className="my-2 text-red-500 text-center mt-4">{error}</p>}
   </div>
  </div>
 );
};

export default ResetPassword;
