import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BiLogOut } from "react-icons/bi";
import { RiLoginBoxFill } from "react-icons/ri";
import { MdOutlineCreate } from "react-icons/md";
import { BsSun, BsMoon } from "react-icons/bs";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useState } from "react";
import { getWebData } from "../../functions/api";
import Loader from "./Loader";
import axios from "axios";
import { apiUrl } from "../../pages/blog/Register";

const Navbar = () => {
 const { currentUser, setCurrentUser } = useAuth();
 const { darkMode, toggleDarkMode } = useTheme();
 const [webData, setWebData] = useState({
  websiteName: "",
  websiteTitle: "",
  favicon: "",
  websiteLogo: "",
  canPublish: true,
  showLogo: false,
  showName: true,
 });
 const [loadingSettings, setLoadingSettings] = useState(false);
 const { colors, darkMode: isDark } = useTheme();

 const navigate = useNavigate();

 const handleLogout = async () => {
  try {
   await axios.get(`${apiUrl}/api/auth/logout?_=${Date.now()}`, {
    withCredentials: true,
   });
   setCurrentUser(null);
   navigate("/login");
  } catch (error) {
   console.log(error);
  }
 };

 const setWebSettings = async () => {
  setLoadingSettings(true);
  const data = await getWebData();
  setWebData(data);
  setLoadingSettings(false);
 };
 const textColor = {
  color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
 };

 useEffect(() => {
  setWebSettings();
 }, []);

 if (loadingSettings) return <Loader />;

 return (
  <nav
   style={{
    backgroundColor: isDark
     ? colors.dark.secondaryBackground
     : colors.light.secondaryBackground,
   }}
   className="shadow-md transition-colors duration-200"
  >
   <div className="container mx-auto px-4 py-2 flex justify-center items-center md:justify-between">
    <Link
     to="/"
     style={textColor}
     className="text-xl  font-light transition-colors
      duration-200 hidden md:flex items-center space-x-2 gap-2"
    >
     {webData.showLogo && (
      <img
       src={webData.websiteLogo}
       alt="Website Logo"
       className="w-8 h-8 object-cover"
      />
     )}
     {webData.showName && webData.websiteName}
    </Link>
    <div className="flex items-center space-x-4">
     <button
      onClick={toggleDarkMode}
      style={{
       backgroundColor: isDark
        ? colors.dark.primaryBackground
        : colors.light.primaryBackground,
      }}
      className="p-2 rounded-full opacity-90 hover:opacity-100 transition-all duration-200"
      aria-label="Toggle dark mode"
     >
      {darkMode ? (
       <BsSun className="text-yellow-500" size={20} />
      ) : (
       <BsMoon className="text-gray-600" size={20} />
      )}
     </button>
     {currentUser ? (
      <>
       <Link
        to="/publish"
        style={textColor}
        className="opacity-80 hover:opacity-100 flex items-center justify-center gap-1 hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-200"
       >
        Publish <MdOutlineCreate size={20} />
       </Link>
       <div
        style={{
         backgroundColor: isDark
          ? colors.dark.primaryBackground
          : colors.light.primaryBackground,
        }}
        className="flex items-center space-x-2 py-1 px-2 rounded-2xl opacity-90 hover:opacity-100 transition-all duration-200"
       >
        <img
         src={currentUser.profilePicture}
         alt="Profile"
         className="w-8 h-8 rounded-full object-cover"
        />
        <Link
         to={"/profile"}
         style={textColor}
         className=" transition-colors duration-200"
        >
         {currentUser.username}
        </Link>
       </div>
       <button
        onClick={handleLogout}
        style={textColor}
        className="flex items-center justify-center gap-1 hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-200"
       >
        Logout
        <BiLogOut className="rotate-x-15 -rotate-y-180" size={20} />
       </button>
      </>
     ) : (
      <>
       <Link
        to="/login"
        style={textColor}
        className="hover:underline hover:underline-offset-4 flex items-center gap-1 justify-center transition-colors duration-200"
       >
        <RiLoginBoxFill size={20} /> Login
       </Link>
       <Link
        to="/register"
        style={textColor}
        className=" hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-200"
       >
        Register
       </Link>
      </>
     )}
    </div>
   </div>
  </nav>
 );
};

export default Navbar;
