import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "./blog/Register";
import { useTheme } from "../context/ThemeContext";

const ConfirmEmail = () => {
 const [userEmail, setUserEmail] = useState("");
 const [successMessage, setSuccessMessage] = useState("");
 const [sending, setSending] = useState(false);
 const [error, setError] = useState("");
 const navigate = useNavigate();
 const { colors, darkMode: isDark } = useTheme();

 const handleOrderNewEmail = async (e) => {
  setError("");
  setSending(true);
  e.preventDefault();
  if (!userEmail || userEmail.trim() === "") return;
  try {
   await axios.post(`${apiUrl}/api/auth/order-new-confirmation-email`, {
    email: userEmail,
   });
   setSuccessMessage("Activation email sent successfully");
  } catch (err) {
   console.log(err);
   setError(
    err.response?.data?.error || "An error occurred during registration."
   );
  } finally {
   setSending(false);
  }
 };

 return (
  <div className="flex items-center justify-center min-h-screen">
   <div
    style={{
     backgroundColor: isDark
      ? colors.dark.secondaryBackground
      : colors.light.secondaryBackground,
    }}
    className="p-8 rounded-lg shadow-md w-full max-w-xl"
   >
    <h2
     style={{
      color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
     }}
     className="text-2xl font-bold mb-2 text-center"
    >
     A verification email has been sent to your email account.
    </h2>
    <p
     style={{
      color: isDark ? colors.dark.secondaryColor : colors.light.secondaryColor,
     }}
     className="text-center mb-4"
    >
     Please check your email and then log in.
    </p>
    {!successMessage && (
     <>
      <label
       style={{
        color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
       }}
      >
       Request verification email again
      </label>
      <input
       type="email"
       value={userEmail}
       onChange={(e) => setUserEmail(e.target.value)}
       style={{
        backgroundColor: isDark
         ? colors.dark.primaryBackground
         : colors.light.primaryBackground,
        color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
       }}
       className="w-full rounded py-2 px-4 mb-4 mt-2 placeholder:opacity-80"
       placeholder="Email"
      />
     </>
    )}
    {userEmail && !successMessage && (
     <button
      disabled={!userEmail || successMessage || sending}
      onClick={handleOrderNewEmail}
      style={{
       backgroundColor: isDark
        ? colors.dark.primaryBtn
        : colors.light.primaryBtn,
      }}
      className="w-full opacity-90 hover:opacity-100 text-white py-2 px-4 rounded-lg transition duration-200"
     >
      {sending ? "Sending..." : "Send"}
     </button>
    )}
    {successMessage && <p className="my-2 text-green-500">{successMessage}</p>}
    {error && <p className="my-2 text-red-500">{error}</p>}
    <p
     style={{
      color: isDark ? colors.dark.secondaryColor : colors.light.secondaryColor,
     }}
     className="my-4 text-sm"
    >
      * If you do not receive the mail, please check your spam folder or contact
     us.
    </p>

    <button
     onClick={() => navigate("/login")}
     style={{
      backgroundColor: isDark
       ? colors.dark.primaryBtn
       : colors.light.primaryBtn,
     }}
     className="w-full opacity-90 hover:opacity-100 text-white py-2 px-4 rounded-lg transition duration-200"
    >
     Login
    </button>
   </div>
  </div>
 );
};

export default ConfirmEmail;
