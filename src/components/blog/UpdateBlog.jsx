import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../../pages/blog/Register";
import Loader from "./Loader";
import { useTheme } from "../../context/ThemeContext";
import TextEditor from "./TextEditor";

const UpdateBlog = () => {
 const { id } = useParams();
 const [blog, setBlog] = useState({ title: "", content: "", tags: [] });
 const [content, setContent] = useState("");
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const [saving, setSaving] = useState(false);
 const navigate = useNavigate();
 const { colors, darkMode: isDark } = useTheme();

 useEffect(() => {
  fetchBlog();
 }, [id]);

 const fetchBlog = async () => {
  try {
   const resp = await axios.get(`${apiUrl}/api/blogs/${id}`);
   setBlog(resp.data);
   setContent(resp.data.content);
   setLoading(false);
  } catch (err) {
   setError("Failed to fetch blog");
   setLoading(false);
  }
 };

 const handleInputChange = (e) => {
  const { name, value } = e.target;
  setBlog({ ...blog, [name]: value });
 };

 const handleTagsChange = (e) => {
  const tags = e.target.value
   .split(/[,،.\s]+/) // Split by comma, Arabic comma, period, or whitespace
   .map((tag) => tag.trim())
   .filter((tag) => tag.length > 0); // Remove empty tags
  setBlog({ ...blog, tags });
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  setError(null);
  try {
   await axios.put(
    `${apiUrl}/api/blogs/${id}`,
    { ...blog, content },
    {
     withCredentials: true,
    }
   );
   navigate(`/blog/${id}`);
  } catch (err) {
   console.log(error);

   if (err.response && err.response.data && err.response.data.error) {
    setError(err.response.data.error);
   } else {
    setError("حدث خطأ اثناء تعديل المدونة");
   }
   console.log(err);
  } finally {
   setSaving(false);
  }
 };

 if (loading) return <Loader />;

 return (
  <div className="min-h-screen p-4">
   <div className="container mx-auto">
    <h1
     style={{
      color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
     }}
     className="text-3xl font-bold mb-6"
    >
     Edite your blog
    </h1>
    <form
     onSubmit={handleSubmit}
     style={{
      backgroundColor: isDark
       ? colors.dark.secondaryBackground
       : colors.light.secondaryBackground,
     }}
     className="p-6 rounded-lg shadow-md"
    >
     <div className="mb-4">
      <label
       style={{
        color: isDark
         ? colors.dark.secondaryColor
         : colors.light.secondaryColor,
       }}
       className="block mb-2"
      >
       Title
      </label>
      <input
       type="text"
       name="title"
       value={blog.title}
       onChange={handleInputChange}
       placeholder="Enter blog title ..."
       style={{
        backgroundColor: isDark
         ? colors.dark.primaryBackground
         : colors.light.primaryBackground,
        color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
       }}
       className="w-full px-4 py-2 rounded-lg placeholder:text-sm"
       required
      />
     </div>
     <div className="mb-4">
      <label
       style={{
        color: isDark
         ? colors.dark.secondaryColor
         : colors.light.secondaryColor,
       }}
       className="block mb-2"
      >
       Content
      </label>
      <TextEditor content={blog.content} setContent={setContent} />
     </div>
     <div className="mb-4">
      <label
       style={{
        color: isDark
         ? colors.dark.secondaryColor
         : colors.light.secondaryColor,
       }}
       className="block mb-2"
      >
       Tags (separated by commas)
      </label>
      <input
       type="text"
       value={blog.tags.join(", ")}
       onChange={handleTagsChange}
       style={{
        backgroundColor: isDark
         ? colors.dark.primaryBackground
         : colors.light.primaryBackground,
        color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
       }}
       placeholder="Write your blog tags..."
       className="w-full px-4 py-2 rounded-lg placeholder:text-sm"
      />
     </div>
     <button
      type="submit"
      style={{
       backgroundColor: isDark
        ? colors.dark.primaryBtn
        : colors.light.primaryBtn,
      }}
      className=" text-white px-4 py-2 rounded-lg transition duration-200"
     >
       {saving ? "Saving..." : "Save"}
     </button>
     {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </form>
   </div>
  </div>
 );
};

export default UpdateBlog;
