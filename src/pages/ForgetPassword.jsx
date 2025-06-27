import axios from "axios";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { apiUrl } from "./blog/Register";

const ForgetPassword = () => {
 const [email, setEmail] = useState("");
 const [message, setMessage] = useState("");
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [hideSendBtn, setHideSendBtn] = useState(false);
 const { colors, darkMode: isDark } = useTheme();

 const handleRequest = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");
  setError("");
  try {
   await axios.post(`${apiUrl}/api/auth/forget-password`, { email });
   setMessage("A password reset link has been sent to your email.");
   setHideSendBtn(true);
  } catch (err) {
   setError(err.response?.data?.error || "Something went wrong.");
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
     Password reset request
    </h2>
    <p
     className="text-center mb-4"
     style={{
      color: isDark ? colors.dark.secondaryColor : colors.light.secondaryColor,
     }}
    >
     Enter your email to receive a reset link.
    </p>
    <input
     type="email"
     value={email}
     onChange={(e) => setEmail(e.target.value)}
     placeholder="Your email"
     className="w-full rounded py-2 px-4 mb-4"
     style={{
      backgroundColor: isDark
       ? colors.dark.primaryBackground
       : colors.light.primaryBackground,
      color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
     }}
    />
    {!hideSendBtn && (
     <button
      onClick={handleRequest}
      disabled={loading || hideSendBtn}
      className="w-full text-white py-2 px-4 rounded-lg transition duration-200"
      style={{
       backgroundColor: isDark
        ? colors.dark.primaryBtn
        : colors.light.primaryBtn,
      }}
     >
      {loading ? " Sending..." : "Ask for reset link"}
     </button>
    )}
    {message && <p className="my-2 text-green-500 text-center">{message}</p>}
    {error && <p className="my-2 text-red-500 text-center mt-4">{error}</p>}
   </div>
  </div>
 );
};

export default ForgetPassword;
