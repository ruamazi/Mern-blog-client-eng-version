import { useEffect, useState } from "react";
import { apiUrl } from "../../pages/blog/Register";
import Loader from "./Loader";
import axios from "axios";
import BlogCard from "./BlogCard";
import { Link } from "react-router-dom";

const RelatedBlogs = ({ blogId }) => {
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState("");
 const [relatedBlogs, setRelatedBlogs] = useState([]);

 const fetchRelatedBlogs = async () => {
  setIsLoading(true);
  setError("");
  try {
   const response = await axios.get(`${apiUrl}/api/blogs/related/${blogId}`);
   setRelatedBlogs(response.data);
  } catch (error) {
   setError(error);
  } finally {
   setIsLoading(false);
  }
 };

 useEffect(() => {
  fetchRelatedBlogs();
 }, [blogId]);

 if (isLoading) return <Loader />;
 if (error) return <p className="text-red-500">{error}</p>;
 if (relatedBlogs.length === 0) return null;

 return (
  <div className="flex flex-col gap-2 flex-1  ">
   <h2 className="text-xl">Related Blogs</h2>
   <div className="flex flex-row lg:flex-col flex-wrap gap-2 flex-1">
    {relatedBlogs.map((blog) => (
     <Link to={`/blog/${blog._id}`} key={blog._id} className="w-full">
      <BlogCard blog={blog} />
     </Link>
    ))}
   </div>
  </div>
 );
};

export default RelatedBlogs;
