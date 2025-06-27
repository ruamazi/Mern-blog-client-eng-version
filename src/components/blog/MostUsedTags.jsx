import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";
import { apiUrl } from "../../pages/blog/Register";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const MostUsedTags = () => {
 const [tags, setTags] = useState([]);
 const [isLoading, setIsLoading] = useState(false);
 const { colors, darkMode: isDark } = useTheme();

 useEffect(() => {
  fetchMostUsedTags();
 }, []);

 const fetchMostUsedTags = async () => {
  setIsLoading(true);
  try {
   const response = await axios.get(`${apiUrl}/api/blogs/most-used-tags`);
   setTags(response.data.data);
  } catch (err) {
   console.error("Error fetching most used tags:", err);
  } finally {
   setIsLoading(false);
  }
 };

 if (isLoading) return <Loader />;

 return (
  <div
   style={{
    backgroundColor: isDark
     ? colors.dark.secondaryBackground
     : colors.light.secondaryBackground,
   }}
   className=" p-4 rounded-lg shadow-lg h-fit py4"
  >
   <h2
    style={{
     color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
    }}
    className="text-xl font-bold mb-4"
   >
    Trending Tags
   </h2>
   <div className="flex flex-wrap gap-2">
    {tags.map((tag) => (
     <Link
      style={{
       backgroundColor: isDark
        ? colors.dark.primaryBtn
        : colors.light.primaryBtn,
      }}
      to={`/blogs/${tag._id}`}
      key={tag._id}
      className="px-3 py-1 rounded text-sm text-white opacity-80"
     >
      {tag._id} ({tag.count})
     </Link>
    ))}
   </div>
  </div>
 );
};

export default MostUsedTags;
