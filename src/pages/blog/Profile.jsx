import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "./Register";
import Loader from "../../components/blog/Loader";
import { Link } from "react-router-dom";
import BlogCard from "../../components/blog/BlogCard";
import { useAuth } from "../../context/AuthContext";
import BackToHome from "../../components/BackToHome";
import { MdDashboardCustomize } from "react-icons/md";
import { useTheme } from "../../context/ThemeContext";
import { isValidImageUrl } from "../../functions/helpers";
import Pagination from "../../components/Pagination";
import { LuMessageCircleQuestion } from "react-icons/lu";

const Profile = ({ setCurrentUser }) => {
 const { currentUser } = useAuth();
 const [profilePicture, setProfilePicture] = useState("");
 const [oldPassword, setOldPassword] = useState("");
 const [newPassword, setNewPassword] = useState("");
 const [message, setMessage] = useState("");
 const [error, setError] = useState("");
 const [blogs, setBlogs] = useState([]);
 const [totalPages, setTotalPages] = useState(1);
 const [currentPage, setCurrentPage] = useState(1);
 const [isLoading, setIsLoading] = useState(false);
 const [updatingProfile, setUpdatingProfile] = useState(false);
 const [banPeriod, setBanPeriod] = useState("");
 const { colors, darkMode: isDark } = useTheme();

 const handleProfileUpdate = async (e) => {
  e.preventDefault();
  setUpdatingProfile(true);
  setMessage("");
  setError("");
  setBanPeriod("");
  try {
   if (!profilePicture || profilePicture.trim() === "") {
    setError("Please enter the image link.");
    return;
   }
   if (!isValidImageUrl(profilePicture)) {
    setError("The link entered is not a valid image link");
    return;
   }
   const resp = await axios.put(
    `${apiUrl}/api/users/profile`,
    { profilePicture },
    {
     withCredentials: true,
    }
   );
   setCurrentUser(resp.data);
   setMessage("Profile updated successfully");
  } catch (err) {
   console.log(err);
   setError(err.response?.data?.error || "Failed to update profile");
   if (err.response.data.remainingTime) {
    setBanPeriod(err.response.data.remainingTime);
   }
  } finally {
   setUpdatingProfile(false);
  }
 };

 const handlePasswordChange = async (e) => {
  e.preventDefault();
  console.log("clicked");
  setUpdatingProfile(true);
  setMessage("");
  setError("");
  try {
   await axios.put(
    `${apiUrl}/api/users/change-password`,
    { oldPassword, newPassword },
    {
     withCredentials: true,
    }
   );
   setMessage("Password changed successfully");
  } catch (err) {
   setError(err.response?.data?.error || "Failed to change password");
  } finally {
   setUpdatingProfile(false);
  }
 };

 useEffect(() => {
  document.title = "Personal page";
  fetchBlogs();
 }, [currentPage]);

 const fetchBlogs = async () => {
  setIsLoading(true);
  try {
   const response = await axios.get(
    `${apiUrl}/api/blogs/user?page=${currentPage}&limit=10`,
    {
     withCredentials: true,
    }
   );
   setBlogs(response.data.blogs);
   setTotalPages(response.data.totalPages);
  } catch (err) {
   console.error(err);
  } finally {
   setIsLoading(false);
  }
 };

 if (isLoading) return <Loader />;

 return (
  <>
   <div className="min-h-screen p-4 flex flex-col gap-6 mx-auto container">
    <div className="container mx-auto">
     <h1
      style={{
       color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
      }}
      className="text-2xl font-bold mb-6"
     >
      Personal page
     </h1>
     {currentUser?.role !== "user" && (
      <Link
       to="/admin"
       style={{
        backgroundColor: isDark
         ? colors.dark.quaternaryBtn
         : colors.light.quaternaryBtn,
       }}
       className="opacity-85 hover:opacity-100 text-white px-4 py-2 rounded-lg transition duration-200 
       mb-4 flex items-center gap-1 w-fit"
      >
       <MdDashboardCustomize className="mb-1" /> Control panel
      </Link>
     )}
     {currentUser.role === "user" && (
      <Link
       to="/contact"
       style={{
        backgroundColor: isDark
         ? colors.dark.quaternaryBtn
         : colors.light.quaternaryBtn,
       }}
       className="opacity-85 hover:opacity-100 text-white px-4 py-2 rounded-lg transition duration-200 
        mb-4 flex items-center gap-1 w-fit"
      >
       <LuMessageCircleQuestion className="mb-1" /> Contact Admins
      </Link>
     )}
     <div
      style={{
       backgroundColor: isDark
        ? colors.dark.secondaryBackground
        : colors.light.secondaryBackground,
      }}
      className="p-6 rounded-lg shadow-md mx-auto max-w-[750px]"
     >
      <h2
       style={{
        color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
       }}
       className="text-xl font-bold mb-4"
      >
       Modify personal information
      </h2>
      <form onSubmit={handleProfileUpdate} className="mb-6">
       <input
        type="text"
        placeholder="Image link"
        value={profilePicture}
        onChange={(e) => setProfilePicture(e.target.value)}
        style={{
         backgroundColor: isDark
          ? colors.dark.primaryBackground
          : colors.light.primaryBackground,
        }}
        className="w-full px-4 py-2  rounded-lg mb-4 placeholder:text-gray-500"
       />
       <button
        type="submit"
        disabled={updatingProfile}
        style={{
         backgroundColor: isDark
          ? colors.dark.primaryBtn
          : colors.light.primaryBtn,
        }}
        className="opacity-85 hover:opacity-100 text-white px-4 py-2 rounded-lg transition duration-200 disabled:opacity-50"
       >
        Save image
       </button>
      </form>
      <h2
       style={{
        color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
       }}
       className="text-xl font-bold mb-4"
      >
       Change the password
      </h2>
      <form onSubmit={handlePasswordChange}>
       <input
        type="password"
        placeholder="Old password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        style={{
         backgroundColor: isDark
          ? colors.dark.primaryBackground
          : colors.light.primaryBackground,
        }}
        className="w-full px-4 py-2  rounded-lg mb-4 placeholder:text-gray-500"
       />
       <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{
         backgroundColor: isDark
          ? colors.dark.primaryBackground
          : colors.light.primaryBackground,
        }}
        className="w-full px-4 py-2  rounded-lg mb-4 placeholder:text-gray-500"
       />
       <button
        type="submit"
        disabled={updatingProfile}
        style={{
         backgroundColor: isDark
          ? colors.dark.primaryBtn
          : colors.light.primaryBtn,
        }}
        className="opacity-85 hover:opacity-100 text-white px-4 py-2 rounded-lg transition duration-200"
       >
        Save new password
       </button>
      </form>
      {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      {banPeriod && (
       <p className="mt-4 text-red-500 text-center">
        Your remaining ban time: {banPeriod}
       </p>
      )}
     </div>
    </div>

    {blogs.length > 0 && (
     <div>
      <h3
       style={{
        color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
       }}
       className="text-2xl font-bold mb-2"
      >
       My posts
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {blogs?.map((blog) => (
        <Link to={`/blog/${blog._id}`} key={blog._id}>
         <BlogCard blog={blog} />
        </Link>
       ))}
      </div>

      {/* Pagination */}
      <Pagination
       totalPages={totalPages}
       currentPage={currentPage}
       setCurrentPage={setCurrentPage}
      />
     </div>
    )}
   </div>
   <BackToHome />
  </>
 );
};

export default Profile;
