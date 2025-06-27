import { useEffect, useState } from "react";
import { apiUrl } from "../../pages/blog/Register";
import axios from "axios";
import Loader from "./Loader";
import { useTheme } from "../../context/ThemeContext";
import { Link } from "react-router-dom";

const PopularBlogs = () => {
 const [blogs, setBlogs] = useState([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const { colors, darkMode: isDark } = useTheme();
 const [period, setPeriod] = useState("week");

 const periodOptions = [
  { value: "day", label: "1 day" },
  { value: "3days", label: "3 days" },
  { value: "week", label: "In the week" },
  { value: "month", label: "In the month" },
 ];

 const getPopularBlogs = async () => {
  try {
   setLoading(true);
   const resp = await axios.get(`${apiUrl}/api/blogs/active?period=${period}`);
   setBlogs(resp.data);
  } catch (error) {
   setError(error);
   setError(resp.data ? resp.data.error : "Failed to load blogs");
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  getPopularBlogs();
 }, [period]);

 if (loading) return <Loader />;
 if (error) return <p className="text-center py-5 text-red-500">{error}</p>;
 if (!blogs) return null;

 return (
  <div
   style={{
    backgroundColor: isDark
     ? colors.dark.secondaryBackground
     : colors.light.secondaryBackground,
   }}
   className=" p-4 rounded-lg shadow-lg h-fit py4"
  >
   <div className="flex justify-between items-center mb-2">
    <h2
     style={{
      color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
     }}
     className="text-xl font-bold"
    >
     Popular blogs
    </h2>
    <select
     value={period}
     onChange={(e) => setPeriod(e.target.value)}
     className="opacity-80 rounded-md p-1 text-sm border border-gray-500"
    >
     {periodOptions.map((option) => (
      <option key={option.value} value={option.value}>
       {option.label}
      </option>
     ))}
    </select>
   </div>
   {blogs && blogs.length > 0 ? (
    <div className="flex flex-col gap-3">
     {blogs.map((blog) => (
      <Link
       to={`/blog/${blog._id}`}
       key={blog._id}
       style={{
        backgroundColor: isDark
         ? colors.dark.primaryBackground
         : colors.light.primaryBackground,
        color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
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
    <p className="text-center py-5 text-gray-500">No popular blogs found</p>
   )}
  </div>
 );
};

export default PopularBlogs;
