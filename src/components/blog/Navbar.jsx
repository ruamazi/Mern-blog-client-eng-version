import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BiLogOut, BiSearch } from "react-icons/bi";
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
 const [searchQuery, setSearchQuery] = useState("");
 const [isSearchVisible, setIsSearchVisible] = useState(false);
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

 const handleSearch = (e) => {
  if (e.key === "Enter" && searchQuery.trim() !== "") {
   navigate(`/search?q=${searchQuery}`);
  }
 };

 const textColor = {
  color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
 };

 useEffect(() => {
  setWebSettings();
 }, []);

 if (loadingSettings) return <Loader />;

 return (
  <>
   <nav
    style={{
     backgroundColor: isDark
      ? colors.dark.secondaryBackground
      : colors.light.secondaryBackground,
    }}
    className="shadow-md transition-colors duration-200"
   >
    <div className="container mx-auto px-4 py-2 flex justify-between items-center">
     <Link
      to="/"
      style={textColor}
      className="text-xl font-light transition-colors duration-200 flex items-center space-x-2 gap-2"
     >
      {webData.showLogo && (
       <img
        src={webData.websiteLogo}
        alt="Website Logo"
        className="w-8 h-8 object-cover"
       />
      )}
      {webData.showName && <span className="hidden md:block">{webData.websiteName}</span>}
     </Link>
     <div className="flex items-center space-x-4">
      <div className="relative hidden md:block">
       <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearch}
        className="p-2 pl-10 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 w-full"
       />
       <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      </div>
      <button
       onClick={() => setIsSearchVisible(!isSearchVisible)}
       className="md:hidden p-2 rounded-full opacity-90 hover:opacity-100 transition-all duration-200"
       aria-label="Toggle search"
      >
       <BiSearch size={20} />
      </button>
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
   <div
    className={`md:hidden transition-all duration-300 ${
     isSearchVisible ? "max-h-screen" : "max-h-0"
    } overflow-hidden`}
    style={{
     backgroundColor: isDark
      ? colors.dark.secondaryBackground
      : colors.light.secondaryBackground,
    }}
   >
    <div className="relative p-4">
     <input
      type="text"
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={handleSearch}
      className="p-2 pl-10 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 w-full"
     />
     <BiSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
    </div>
   </div>
  </>
 );
};

export default Navbar;
