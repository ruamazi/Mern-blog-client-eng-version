import { useEffect, useState } from "react";
import Loader from "./Loader";
import axios from "axios";
import { apiUrl } from "../../pages/blog/Register";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import Pagination from "../Pagination";

const UserBlogs = ({ username, userId }) => {
 const [blogs, setBlogs] = useState([]);
 const [loading, setLoading] = useState(false);
 const [currentPage, setCurrentPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);
 const { colors, darkMode: isDark } = useTheme();

 const getUserBlogs = async () => {
  setLoading(true);
  try {
   const resp = await axios.get(
    `${apiUrl}/api/blogs/get-user-blogs/${userId}?page=${currentPage}`
   );
   setBlogs(resp.data.blogs);
   setTotalPages(resp.data.totalPages);
  } catch (error) {
   console.log(error);
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  getUserBlogs();
 }, [currentPage, username]);

 if (loading) return <Loader />;

 return (
  <div
   style={{
    backgroundColor: isDark
     ? colors.dark.secondaryBackground
     : colors.light.secondaryBackground,
   }}
   className="flex flex-col gap-1 py-3 px-2 shadow-md rounded-lg mb-10 max-w-4xl mx-auto "
  >
   <h1
    style={{
     color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
    }}
    className="text-xl flex gap-1 items-center font-semibold mb-2"
   >
    Posts of {username}
   </h1>
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
    <p className="text-gray-500 text-center mt-3.5 mb-10">No posts found</p>
   )}
   <Pagination
    currentPage={currentPage}
    setCurrentPage={setCurrentPage}
    totalPages={totalPages}
   />
  </div>
 );
};

export default UserBlogs;
