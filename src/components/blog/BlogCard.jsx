import { useState } from "react";
import { MdPublicOff } from "react-icons/md";
import Loader from "./Loader";
import axios from "axios";
import { apiUrl } from "../../pages/blog/Register";
import { useTheme } from "../../context/ThemeContext";

const BlogCard = ({ blog, setBlogs, isAdmin }) => {
 const isPending = blog?.status === "pending";
 const [loading, setLoading] = useState(false);
 const { colors, darkMode: isDark } = useTheme();

 const handleApprove = async () => {
  setLoading(true);
  try {
   const resp = await axios.get(
    `${apiUrl}/api/admin/approve-blog/${blog._id}`,
    { withCredentials: true }
   );
   setBlogs((prev) => prev.map((b) => (b._id === blog._id ? resp.data : b)));
  } catch (error) {
   console.log(error);
  } finally {
   setLoading(false);
  }
 };
 const stripHtmlTags = (html) => {
  if (typeof html !== "string") return "";
  return html.replace(/<[^>]*>?/gm, "");
 };

 if (loading) return <Loader />;
 const plainTextContent = stripHtmlTags(blog.content);

 return (
  <div
   style={{
    backgroundColor: isDark
     ? colors.dark.secondaryBackground
     : colors.light.secondaryBackground,
   }}
   className={`${
    isPending ? "opacity-50" : ""
   }  p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden  h-full  flex flex-col justify-between`}
  >
   <div>
    <h2
     style={{
      color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
     }}
     className="text-xl font-bold mb-2"
    >
     {blog.title.length > 50 ? `${blog.title.substring(0, 50)}...` : blog.title}
    </h2>
    <p
     style={{
      color: isDark ? colors.dark.secondaryColor : colors.light.secondaryColor,
     }}
     className="mb-4 opacity-90"
    >
     {plainTextContent.length > 100
      ? `${plainTextContent.substring(0, 100)}...`
      : plainTextContent}
    </p>
   </div>
   <div className="flex items-center justify-between flex-wrap">
    <div className="flex items-center gap-2">
     <img
      src={blog.author.profilePicture}
      alt="Author"
      className="w-10 h-10 rounded-full mr-2 object-cover"
     />
     <span
      style={{
       color: isDark ? colors.dark.secondaryColor : colors.light.secondaryColor,
      }}
      className="opacity-70"
     >
      {blog.author.username}
     </span>
    </div>
    {isAdmin && isPending && (
     <button
      onClick={handleApprove}
      style={{
       backgroundColor: isDark
        ? colors.dark.secondaryBtn
        : colors.light.secondaryBtn,
      }}
      className="text-white px-4 py-2 rounded-md transition-colors duration-200"
     >
      Accepte
     </button>
    )}
    {!isAdmin && isPending && <p className="text-xs">Waiting for approval</p>}
    {blog.private && (
     <MdPublicOff
      className="opacity-70"
      style={{
       color: isDark ? colors.dark.secondaryColor : colors.light.secondaryColor,
      }}
      size={20}
     />
    )}
   </div>
  </div>
 );
};

export default BlogCard;
