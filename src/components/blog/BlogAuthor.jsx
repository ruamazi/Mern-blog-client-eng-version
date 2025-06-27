import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const BlogAuthor = ({ author }) => {
 const { colors, darkMode: isDark } = useTheme();

 return (
  <Link
   to={`/user/${author.username}`}
   style={{
    backgroundColor: isDark ? colors.dark.grayColor : colors.light.grayColor,
   }}
   className="flex items-center mb-3 gap-2 w-fit py-[1px] pl-1 pr-3 rounded-2xl rounded-tl-none
   opacity-70 hover:opacity-90 transition-all duration-200"
  >
   <img
    src={author.profilePicture}
    alt="Author"
    className="w-10 h-10 rounded-full object-cover border-white border-2"
   />
   <span className="text-white font-bold">{author.username}</span>
  </Link>
 );
};

export default BlogAuthor;
