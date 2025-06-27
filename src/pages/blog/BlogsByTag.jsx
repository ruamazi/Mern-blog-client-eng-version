import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import BlogCard from "../../components/blog/BlogCard";
import { apiUrl } from "./Register";
import Loader from "../../components/blog/Loader";
import BackToHome from "../../components/BackToHome";
import { useTheme } from "../../context/ThemeContext";
import Pagination from "../../components/Pagination";

const BlogsByTag = () => {
 const { tag } = useParams(); // Get the tag from the URL
 const [blogs, setBlogs] = useState([]);
 const [currentPage, setCurrentPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);
 const [isLoading, setIsLoading] = useState(false);
 const { colors, darkMode: isDark } = useTheme();

 useEffect(() => {
  document.title = `#${tag}`;
  fetchBlogsByTag();
 }, [currentPage, tag]); // Re-fetch blogs when the page or tag changes

 const fetchBlogsByTag = async () => {
  setIsLoading(true);
  try {
   const resp = await axios.get(
    `${apiUrl}/api/blogs/tag?tag=${tag}&page=${currentPage}&limit=10`
   );
   setBlogs(resp.data.blogs);
   setTotalPages(resp.data.totalPages);
  } catch (err) {
   console.error(err);
  } finally {
   setIsLoading(false);
  }
 };

 if (isLoading) return <Loader />;

 return (
  <>
   <div className="min-h-screen p-4">
    <div className="container mx-auto">
     {blogs.length > 0 ? (
      <>
       <h1
        style={{
         color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
        }}
        className="text-2xl font-bold mb-6"
       >
        Posts with hashtag:{" "}
        <span
         style={{
          color: isDark ? colors.dark.primaryBtn : colors.light.primaryBtn,
         }}
        >
         {tag}
        </span>
       </h1>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
         <Link to={`/blog/${blog._id}`} key={blog._id}>
          <BlogCard blog={blog} />
         </Link>
        ))}
       </div>
       <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
       />
      </>
     ) : (
      <div className="flex flex-col items-center">
       <h1 className="text-lg md:text-2xl font-bold mb-6 text-gray-800 dark:text-white  mt-12">
        There are no posts with the hashtag:{" "}
        <span
         style={{
          color: isDark ? colors.dark.primaryBtn : colors.light.primaryBtn,
         }}
        >
         {tag}
        </span>
       </h1>
       <Link to="/" className="text-blue-500 hover:underline">
        Back to Home Page
       </Link>
      </div>
     )}
    </div>
   </div>
   {blogs.length > 0 && <BackToHome />}
  </>
 );
};

export default BlogsByTag;
