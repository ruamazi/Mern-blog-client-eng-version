import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import Loader from "./Loader";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../pages/blog/Register";
import { useAuth } from "../../context/AuthContext";

const FollowedUsersBlogs = () => {
 const [blogs, setBlogs] = useState([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const { colors, darkMode: isDark } = useTheme();
 const { currentUser } = useAuth();
 if (!currentUser) return null;

 const bgMain = isDark
  ? colors.dark.primaryBackground
  : colors.light.primaryBackground;
 const bgSecondary = isDark
  ? colors.dark.secondaryBackground
  : colors.light.secondaryBackground;
 const textMain = isDark ? colors.dark.primaryColor : colors.light.primaryColor;

 const fetchBlogs = async () => {
  setLoading(true);
  setError(null);
  try {
   const resp = await axios.get(`${apiUrl}/api/blogs/followed-users-blogs`, {
    withCredentials: true,
   });
   setBlogs(resp.data);
  } catch (error) {
   console.log(error);
   setError(error.response.data.error || "Failed to fetch blogs");
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  fetchBlogs();
 }, []);

 if (loading) return <Loader />;
 if (error) return <p className="text-center py-5 text-red-500">{error}</p>;
 if (!blogs) return null;

 return (
  <div
   style={{
    backgroundColor: bgSecondary,
   }}
   className=" p-4 rounded-lg shadow-lg h-fit py4"
  >
   <div className="flex justify-between items-center mb-2">
    <h2
     style={{
      color: textMain,
     }}
     className=" font-bold"
    >
     Posts from people I follow
    </h2>
   </div>
   {blogs && blogs.length > 0 ? (
    <div className="flex flex-col gap-3">
     {blogs.map((blog) => (
      <Link
       to={`/blog/${blog._id}`}
       key={blog._id}
       style={{
        backgroundColor: bgMain,
       }}
       className="px-4 py-2 rounded text-sm opacity-80 shadow-md hover:scale-101 transition-all duration-200"
      >
       {blog.title.length > 50
        ? `${blog.title.substring(0, 50)}...`
        : blog.title}
      </Link>
     ))}
    </div>
   ) : (
    <p className="text-center py-5 text-gray-500">No blogs found</p>
   )}
  </div>
 );
};

export default FollowedUsersBlogs;
