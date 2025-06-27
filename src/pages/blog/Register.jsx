import { useEffect, useState } from "react";
import axios from "axios";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { useTheme } from "../../context/ThemeContext";
import { Link } from "react-router-dom";

export const apiUrl =
 import.meta.env.VITE_ENV === "development"
  ? "http://localhost:3030"
  : "https://blog-02-02-api-arabic.vercel.app";

const Register = () => {
 const [username, setUsername] = useState("");
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);
 const [showPassword, setShowPassword] = useState(false);
 const { colors, darkMode: isDark } = useTheme();

 const handleSubmit = async (e) => {
  setLoading(true);
  setError("");
  e.preventDefault();
  try {
   await axios.post(`${apiUrl}/api/auth/register`, {
    username,
    email,
    password,
   });
   window.location.href = "/confirm-email";
  } catch (err) {
   console.log(err);
   setError(err.response?.data?.error || "Failed to register");
  } finally {
   setLoading(false);
  }
 };

 const handleShowPassword = () => {
  setShowPassword(!showPassword);
 };

 useEffect(() => {
  document.title = "Join Now";
 }, []);

 return (
  <div className="flex items-center justify-center min-h-screen">
   <div
    style={{
     backgroundColor: isDark
      ? colors.dark.secondaryBackground
      : colors.light.secondaryBackground,
    }}
    className="p-8 rounded-lg shadow-md w-full max-w-md"
   >
    <h2
     style={{
      color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
     }}
     className="text-2xl font-bold mb-6 text-center"
    >
     Join us now
    </h2>
    {error && <p className="text-red-500 mb-4">{error}</p>}
    <form onSubmit={handleSubmit}>
     <div className="mb-4">
      <label
       htmlFor="username"
       style={{
        color: isDark
         ? colors.dark.secondaryColor
         : colors.light.secondaryColor,
       }}
       className="block mb-2"
      >
       Username
      </label>
      <input
       type="text"
       id="username"
       value={username}
       onChange={(e) => setUsername(e.target.value)}
       placeholder="Enter your username"
       style={{
        backgroundColor: isDark
         ? colors.dark.primaryBackground
         : colors.light.primaryBackground,
        color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
       }}
       className="w-full px-4 py-2 placeholder:text-sm rounded-lg focus:outline-none focus:ring-2 placeholder:opacity-80"
       required
      />
     </div>
     <div className="mb-4">
      <label
       htmlFor="email"
       style={{
        color: isDark
         ? colors.dark.secondaryColor
         : colors.light.secondaryColor,
       }}
       className="block mb-2"
      >
       Email
      </label>
      <input
       type="email"
       id="email"
       value={email}
       onChange={(e) => setEmail(e.target.value)}
       placeholder="email@example.com"
       style={{
        backgroundColor: isDark
         ? colors.dark.primaryBackground
         : colors.light.primaryBackground,
        color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
       }}
       className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 placeholder:opacity-80"
       required
      />
     </div>
     <div className="mb-6 relative">
      <label
       htmlFor="password"
       style={{
        color: isDark
         ? colors.dark.secondaryColor
         : colors.light.secondaryColor,
       }}
       className="block mb-2"
      >
       Password
      </label>
      <input
       type={showPassword ? "text" : "password"}
       id="password"
       value={password}
       onChange={(e) => setPassword(e.target.value)}
       placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
       style={{
        backgroundColor: isDark
         ? colors.dark.primaryBackground
         : colors.light.primaryBackground,
        color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
       }}
       className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 placeholder:opacity-80 placeholder:text-sm"
       required
      />
      {password.length > 0 && (
       <span className="absolute top-11 right-2">
        {showPassword ? (
         <BiSolidHide
          className="text-2xl cursor-pointer opacity-80"
          size={20}
          onClick={handleShowPassword}
         />
        ) : (
         <BiSolidShow
          className=" text-2xl cursor-pointer opacity-80"
          size={20}
          onClick={handleShowPassword}
         />
        )}
       </span>
      )}
     </div>
     <button
      type="submit"
      disabled={loading}
      style={{
       backgroundColor: isDark
        ? colors.dark.primaryBtn
        : colors.light.primaryBtn,
      }}
      className="w-full opacity-90 hover:opacity-100 text-white py-2 px-4 rounded-lg  transition duration-200"
     >
       {loading ? " Loading..." : "Sign Up"}
     </button>
    </form>
    <p
     style={{
      color: isDark ? colors.dark.secondaryColor : colors.light.secondaryColor,
     }}
     className="mt-4 text-center"
    >
     you have an account ?&nbsp;
     <Link
      to="/login"
      style={{
       color: isDark ? colors.dark.primaryBtn : colors.light.primaryBtn,
      }}
      className="hover:underline"
     >
      Login
     </Link>
    </p>
   </div>
  </div>
 );
};

export default Register;
