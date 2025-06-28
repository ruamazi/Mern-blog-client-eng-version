import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import BlogCard from "../components/blog/BlogCard";
import { apiUrl } from "./blog/Register";
import Loader from "../components/blog/Loader";
import Pagination from "../components/Pagination";

const SearchResults = () => {
 const [blogs, setBlogs] = useState([]);
 const [currentPage, setCurrentPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);
 const [isLoading, setIsLoading] = useState(false);
 const location = useLocation();
 const searchQuery = new URLSearchParams(location.search).get("q");

 useEffect(() => {
  if (searchQuery) {
   fetchBlogs();
  }
 }, [searchQuery, currentPage]);

 const fetchBlogs = async () => {
  setIsLoading(true);
  try {
   const response = await axios.get(
    `${apiUrl}/api/blogs/search?q=${searchQuery}&page=${currentPage}&limit=10`
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
  <div className="min-h-screen p-4">
   <div className="container mx-auto">
    <h1 className="text-2xl font-bold mb-6">Search Results for "{searchQuery}"</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
     {blogs?.map((blog) => (
      <Link to={`/blog/${blog._id}`} key={blog._id}>
       <BlogCard blog={blog} setBlogs={setBlogs} />
      </Link>
     ))}
    </div>
    <Pagination
     currentPage={currentPage}
     setCurrentPage={setCurrentPage}
     totalPages={totalPages}
    />
   </div>
  </div>
 );
};

export default SearchResults;