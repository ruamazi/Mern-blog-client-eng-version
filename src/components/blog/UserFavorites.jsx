import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { apiUrl } from "../../pages/blog/Register";
import axios from "axios";
import Pagination from "../Pagination";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "./Loader";

const UserFavorites = ({ userId, showFavState }) => {
 const [blogs, setBlogs] = useState([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [currentPage, setCurrentPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);
 const [visibale, setVisibale] = useState(showFavState);
 const { colors, darkMode: isDark } = useTheme();
 const { currentUser } = useAuth();

 const fetchFavorites = async () => {
  setLoading(true);
  setError("");
  try {
   const response = await axios.get(
    `${apiUrl}/api/blogs/user-fav-blogs/${userId}?page=${currentPage}`
   );
   setBlogs(response.data.blogs);
   setTotalPages(response.data.totalPages);
  } catch (error) {
   console.error(error);
   setError(error.response.data.error || "Failed to fetch favorites");
  } finally {
   setLoading(false);
  }
 };

 const handleHideFavs = async (userId, newValue) => {
  try {
   await axios.put(
    `${apiUrl}/api/users/show-hide-favorites/${userId}`,
    {
     visibale: newValue,
    },
    { withCredentials: true }
   );
  } catch (error) {
   console.error(error);
  }
 };

 useEffect(() => {
  fetchFavorites();
 }, [currentPage]);

 if (!showFavState && currentUser?._id !== userId) return null;
 if (loading) return <Loader />;
 if (error) return <p className="text-red-500 text-center text-sm">{error}</p>;

 return (
  <div
   style={{
    backgroundColor: isDark
     ? colors.dark.secondaryBackground
     : colors.light.secondaryBackground,
   }}
   className="flex flex-col gap-1 py-3 px-2 shadow-md rounded-lg mb-10 max-w-4xl mx-auto "
  >
   <div className="flex justify-between flex-col md:flex-row">
    <h1
     style={{
      color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
     }}
     className="text-xl flex gap-1 items-center font-semibold mb-2"
    >
     Favorites list
    </h1>
    {currentUser?._id === userId && (
     <div className="flex items-center gap-1 text-sm">
      <label htmlFor="checkbox">Everyone can see favorites</label>
      <input
       type="checkbox"
       id="checkbox"
       checked={visibale}
       onChange={(e) => {
        const newValue = e.target.checked;
        setVisibale(newValue);
        handleHideFavs(userId, newValue);
       }}
      />
     </div>
    )}
   </div>

   {blogs.length > 0 ? (
    blogs.map((blog) => (
     <div
      key={blog._id}
      style={{
       backgroundColor: isDark
        ? colors.dark.primaryBackground
        : colors.light.primaryBackground,
       color: isDark ? colors.dark.secondaryColor : colors.light.secondaryColor,
      }}
      className="flex mb-2 justify-between flex-col md:flex-row shadow-md p-2 rounded-lg hover:scale-101 transition-all duration-200"
     >
      <Link to={`/blog/${blog._id}`}>
       {blog.title.length > 50
        ? `${blog.title.substring(0, 50)}...`
        : blog.title}
      </Link>
      <div dir="rtl" className="flex gap-1 flex-wrap">
       {blog.tags.length > 0 &&
        blog.tags.map((tag) => (
         <Link
          to={`/blogs/${tag}`}
          key={tag}
          style={{
           backgroundColor: isDark
            ? colors.dark.secondaryBackground
            : colors.light.secondaryBackground,
          }}
          className="text-xs px-2 py-1 rounded-lg"
         >
          {tag}
         </Link>
        ))}
      </div>
     </div>
    ))
   ) : (
    <p className="text-gray-500 text-center mt-3.5 mb-10">No favorites yet</p>
   )}
   <Pagination
    currentPage={currentPage}
    setCurrentPage={setCurrentPage}
    totalPages={totalPages}
   />
  </div>
 );
};

export default UserFavorites;
