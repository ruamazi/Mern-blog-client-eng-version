import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import Loader from "./Loader";
import StatItem from "./StatItem";
import { dateFormatter } from "../../functions/dateFormatter";
import axios from "axios";
import { apiUrl } from "../../pages/blog/Register";
import { Link } from "react-router-dom";

const UserStats = ({ profileUser, userId }) => {
 const [userStats, setUserStats] = useState();
 const [loadingStats, setLoadingStats] = useState(false);

 const getUserStats = async (id) => {
  if (!id) return;
  setLoadingStats(true);
  try {
   const resp = await axios.get(`${apiUrl}/api/blogs/user-stats/${id}`);
   setUserStats(resp.data);
  } catch (error) {
   console.error("Error fetching user stats:", error);
   setUserStats(null);
  } finally {
   setLoadingStats(false);
  }
 };
 useEffect(() => {
  if (userId) {
   getUserStats(userId);
  }
 }, [userId]);

 const { colors, darkMode: isDark } = useTheme();
 return (
  <div
   style={{
    backgroundColor: isDark
     ? colors.dark.primaryBackground
     : colors.light.primaryBackground,
   }}
   className="flex-1 p-4 rounded-lg shadow-lg "
  >
   <h3
    style={{
     color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
    }}
    className="text-xl font-semibold mb-4 pb-2 border-b border-gray-300 dark:border-gray-600"
   >
    Stats for {profileUser.username}
   </h3>
   {loadingStats ? (
    <div className="flex justify-center items-center h-40">
     <Loader size="small" /> {/* Or a text message */}
    </div>
   ) : userStats ? ( // Check if userStats is not null
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
     <StatItem label="Join Date" value={dateFormatter(profileUser.createdAt)} />
     <StatItem
      label="Account age (days)"
      value={userStats.accountAge ?? "N/A"}
     />
     <StatItem label="Total articles" value={userStats.totalBlogs ?? 0} />
     <StatItem
      label="Published articles"
      value={userStats.publishedBlogs ?? 0}
     />
     <StatItem
      label="Articles under review"
      value={userStats.pendingBlogs ?? 0}
     />
     <StatItem
      label="Total likes (on his articles)"
      value={userStats.totalLikes ?? 0}
     />
     <StatItem
      label="Total dislikes (on his articles)"
      value={userStats.totalDislikes ?? 0}
     />
     <StatItem
      label="Total Comments (Written by)"
      value={userStats.totalCommentsMade ?? 0}
     />
     <StatItem
      label="Total liked articles"
      value={userStats.totalBlogsLiked ?? 0}
     />
     {/* Conditional Rendering for specific blog links */}
     {userStats.mostLikedBlog ? (
      <StatItem
       label="Most Liked Article"
       value={userStats.mostLikedBlog.title}
       isLink={true}
       to={`/blog/${userStats.mostLikedBlog._id}`} // Adjust route as needed
      />
     ) : (
      <StatItem label="Most Liked Article" value="Not available" />
     )}
     {userStats.mostCommentedBlog ? (
      <StatItem
       label="Most commented article"
       value={userStats.mostCommentedBlog.title}
       isLink={true}
       to={`/blog/${userStats.mostCommentedBlog._id}`} // Adjust route as needed
      />
     ) : (
      <StatItem label="Most commented article" value="Not available" />
     )}

     {/* Calculated Stats */}
     <StatItem
      label="Average likes per article"
      value={userStats.avgLikesPerBlog?.toFixed(2) ?? "N/A"}
     />
     <StatItem
      label="Average comments per article"
      value={userStats.avgCommentsPerBlog?.toFixed(2) ?? "N/A"}
     />
     <StatItem
      label="Engagement Rate" // Consider explaining this metric if unclear
      value={userStats.engagementRate?.toFixed(2) ?? "N/A"}
     />

     {/* Top Tags - Spans across two columns if needed */}
     {userStats.topTags && userStats.topTags.length > 0 && (
      <div className="sm:col-span-2 mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
       <span
        style={{
         color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
        }}
        className="font-semibold"
       >
        {" "}
        Most used tags:
       </span>
       <div className="flex flex-wrap gap-2 mt-1">
        {userStats.topTags.map((tag) => (
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
     )}
    </div>
   ) : (
    <p className="text-center text-red-500 py-10">
     No statistics found for this user.
    </p>
   )}
  </div>
 );
};

export default UserStats;
