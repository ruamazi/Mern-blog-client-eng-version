import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BlogCard from "../components/blog/BlogCard";
import { apiUrl } from "./blog/Register";
import Loader from "../components/blog/Loader";
import MostUsedTags from "../components/blog/MostUsedTags";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Pagination from "../components/Pagination";
import PopularBlogs from "../components/blog/PopularBlogs";
import FollowedUsersBlogs from "../components/blog/FollowedUsersBlogs";

const Home = ({ webSettings }) => {
 const [blogs, setBlogs] = useState([]);
 const [currentPage, setCurrentPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);
 const [isLoading, setIsLoading] = useState(false);
 const { currentUser } = useAuth();
 const { colors, darkMode: isDark } = useTheme();

 useEffect(() => {
  fetchBlogs();
 }, [currentPage]);

 useEffect(() => {
  if (webSettings.websiteTitle && document.title !== webSettings.websiteTitle) {
   document.title = webSettings.websiteTitle; // Set the title dynamically
  }
 }, [webSettings]);

 const isAdmin =
  currentUser?.role === "admin" || currentUser?.role === "superAdmin";

 const fetchBlogs = async () => {
  setIsLoading(true);
  try {
   if (isAdmin) {
    const resp = await axios.get(
     `${apiUrl}/api/admin/all-blogs?page=${currentPage}&limit=10`,
     { withCredentials: true }
    );
    setBlogs(resp.data.blogs);
    setTotalPages(resp.data.totalPages);
   } else {
    const response = await axios.get(
     `${apiUrl}/api/blogs?page=${currentPage}&limit=10`
    );
    setBlogs(response.data.blogs);
    setTotalPages(response.data.totalPages);
   }
  } catch (err) {
   console.error(err);
  } finally {
   setIsLoading(false);
  }
 };

 if (isLoading) return <Loader />;

 return (
  <div
   style={{
    backgroundColor: isDark
     ? colors.dark.primaryBackground
     : colors.light.primaryBackground,
   }}
   className="min-h-screen p-4"
  >
   <div className="container mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
     {/* Main Content */}
     <div className="lg:col-span-3">
      <h1
       style={{
        color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
       }}
       className="text-2xl font-bold mb-6"
      >
       Latest Blogs
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {blogs?.map((blog) => (
        <Link to={`/blog/${blog._id}`} key={blog._id}>
         <BlogCard blog={blog} setBlogs={setBlogs} isAdmin={isAdmin} />
        </Link>
       ))}
      </div>
      <Pagination
       currentPage={currentPage}
       setCurrentPage={setCurrentPage}
       totalPages={totalPages}
      />
     </div>
     <div className="flex flex-col gap-4">
      {/* Sidebar for Most Used Tags */}
      {blogs?.length > 0 && <MostUsedTags />}
      <PopularBlogs />
      <FollowedUsersBlogs />
     </div>
    </div>
   </div>
  </div>
 );
};

export default Home;
