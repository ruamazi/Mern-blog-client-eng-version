import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../pages/blog/Register";
import { Link } from "react-router-dom";
import Loader from "../blog/Loader";
import { useTheme } from "../../context/ThemeContext";
import ConfirmationModal from "../blog/ConfirmationModal";
import Pagination from "../Pagination";

const BlogsList = () => {
 const [blogs, setBlogs] = useState([]);
 const [loadingBlogs, setLoadingBlogs] = useState(false);
 const [error, setError] = useState(null);
 const [deletingBlogId, setDeletingBlogId] = useState(null);
 const [updatingStatusId, setUpdatingStatusId] = useState(null);
 const [approvingBlogId, setApprovingBlogId] = useState(null);
 const [showModal, setShowModal] = useState({ status: false, blogId: null });
 const [currentPage, setCurrentPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);
 const { colors, darkMode: isDark } = useTheme();

 useEffect(() => {
  fetchBlogs();
 }, [currentPage]);

 const fetchBlogs = async () => {
  setLoadingBlogs(true);
  setError(null);
  try {
   const response = await axios.get(
    `${apiUrl}/api/admin/blogs?page=${currentPage}`,
    {
     withCredentials: true,
    }
   );
   setBlogs(response.data.blogs);
   setTotalPages(response.data.totalPages);
  } catch (error) {
   console.error(error);
   setError("Something went wrong");
  } finally {
   setLoadingBlogs(false);
  }
 };

 const handleToggleStatus = async (blogId) => {
  setUpdatingStatusId(blogId);
  try {
   await axios.put(
    `${apiUrl}/api/admin/blogs/${blogId}/status`,
    {},
    {
     withCredentials: true,
    }
   );
   fetchBlogs();
  } catch (error) {
   console.error(error);
  } finally {
   setUpdatingStatusId(null);
  }
 };

 const handleDeleteBlog = async (blogId) => {
  setDeletingBlogId(blogId);
  try {
   await axios.delete(`${apiUrl}/api/blogs/${blogId}`, {
    withCredentials: true,
   });
   fetchBlogs();
  } catch (error) {
   console.error(error);
  } finally {
   setDeletingBlogId(null);
   setShowModal({ status: false, blogId: null });
  }
 };

 const handleApproveBlog = async (blogId) => {
  setApprovingBlogId(blogId);
  try {
   const resp = await axios.get(`${apiUrl}/api/admin/approve-blog/${blogId}`, {
    withCredentials: true,
   });
   setBlogs((prevBlogs) =>
    prevBlogs.map((blog) =>
     blog._id === blogId ? { ...blog, status: resp.data.status } : blog
    )
   );
  } catch (error) {
   console.log(error);
  } finally {
   setApprovingBlogId(null);
  }
 };

 if (loadingBlogs) return <Loader />;
 if (error) return <p className="text-red-600 py-6 text-center">{error}</p>;

 return (
  <div className="overflow-x-auto">
   <table
    style={{
     backgroundColor: isDark
      ? colors.dark.secondaryBackground
      : colors.light.secondaryBackground,
    }}
    className="min-w-full divide-y overflow-y-scroll"
   >
    <thead
     style={{
      backgroundColor: isDark
       ? colors.dark.secondaryBackground
       : colors.light.secondaryBackground,
     }}
    >
     <tr
      style={{
       color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
      }}
     >
      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium">
       Title
      </th>
      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium hidden sm:table-cell">
       Writer
      </th>
      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium">
       Status
      </th>
      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium">
       Actions
      </th>
     </tr>
    </thead>
    <tbody
     style={{
      backgroundColor: isDark
       ? colors.dark.secondaryBackground
       : colors.light.secondaryBackground,
     }}
     className="divide-y divide-gray-200 dark:divide-gray-700"
    >
     {blogs.map((blog) => (
      <tr
       key={blog._id}
       className={`${
        blog.status === "pending" ? "bg-yellow-100 dark:bg-blue-300/10" : ""
       }`}
      >
       <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm">
        <Link
         to={`/blog/${blog._id}`}
         style={{
          color: isDark ? colors.dark.primaryBtn : colors.light.primaryBtn,
         }}
         className="hover:underline"
        >
         {blog.title.length > 30
          ? blog.title.substring(0, 30) + "..."
          : blog.title}
        </Link>
        <p
         style={{
          color: isDark
           ? colors.dark.secondaryColor
           : colors.light.secondaryColor,
         }}
         className="text-xs block sm:hidden"
        >
         By: {blog.author.username}
        </p>
       </td>
       <td
        style={{
         color: isDark
          ? colors.dark.secondaryColor
          : colors.light.secondaryColor,
        }}
        className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm hidden sm:table-cell"
       >
        {blog.author.username}
       </td>
       <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm">
        <span
         className={`px-2 py-1 rounded text-xs ${
          !blog.private
           ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
           : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
         }`}
        >
         {!blog.private ? "Public" : "Private"}
        </span>
       </td>
       <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm">
        <div className="flex flex-col sm:flex-row gap-2">
         <button
          style={{
           backgroundColor: isDark
            ? colors.dark.primaryBtn
            : colors.light.primaryBtn,
          }}
          onClick={() => handleToggleStatus(blog._id)}
          disabled={updatingStatusId === blog._id}
          className="opacity-90 hover:opacity-100 transition-opacity duration-300 text-white px-2 py-1 sm:px-3 sm:py-1 rounded text-xs sm:text-sm"
         >
          {updatingStatusId === blog._id
           ? "Updating..."
           : !blog.private
           ? "Hide"
           : "Show"}
         </button>
         <button
          onClick={() => setShowModal({ status: true, blogId: blog._id })}
          disabled={deletingBlogId === blog._id}
          style={{
           backgroundColor: isDark
            ? colors.dark.tertiaryBtn
            : colors.light.tertiaryBtn,
          }}
          className="opacity-90 hover:opacity-100 transition-opacity duration-300 text-white px-2 py-1 sm:px-3 sm:py-1 rounded text-xs sm:text-sm"
         >
          {deletingBlogId === blog._id ? "Deleting..." : "Delete"}
         </button>
         {blog.status === "pending" && (
          <button
           onClick={() => handleApproveBlog(blog._id)}
           disabled={approvingBlogId === blog._id}
           style={{
            backgroundColor: isDark
             ? colors.dark.secondaryBtn
             : colors.light.secondaryBtn,
           }}
           className="opacity-90 hover:opacity-100 transition-opacity duration-300 text-white px-2 py-1 sm:px-3 sm:py-1 rounded text-xs sm:text-sm"
          >
           {approvingBlogId === blog._id ? "Approving..." : "Approve"}
          </button>
         )}
        </div>
       </td>
      </tr>
     ))}
    </tbody>
   </table>
   <Pagination
    currentPage={currentPage}
    setCurrentPage={setCurrentPage}
    totalPages={totalPages}
   />
   <ConfirmationModal
    isOpen={showModal.status}
    onClose={() => setShowModal({ status: false, blogId: null })}
    onConfirm={() => handleDeleteBlog(showModal.blogId)}
    message="Are you sure you want to delete this blog?"
   />
  </div>
 );
};

export default BlogsList;
