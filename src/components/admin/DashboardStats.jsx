import React from "react";
import { FaUsers, FaBlog, FaComments } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { useTheme } from "../../context/ThemeContext";
import { Link } from "react-router-dom";

const DashboardStats = ({ stats }) => {
 const { colors, darkMode: isDark } = useTheme();
 const cardBg = isDark
  ? colors.dark.primaryBackground
  : colors.light.primaryBackground;
 const cardBgSecondary = isDark
  ? colors.dark.secondaryBackground
  : colors.light.secondaryBackground;
 const textColor = isDark
  ? colors.dark.secondaryColor
  : colors.light.secondaryColor;

 const StatCard = ({ title, value, icon, color }) => (
  <div
   style={{ backgroundColor: cardBg }}
   className="p-4 sm:p-6 rounded-lg shadow-md"
  >
   <div className="flex items-center gap-4">
    <div className={`p-3 rounded-full ${color[0]} text-white`}>{icon}</div>
    <div className="flex gap-3">
     <h3
      style={{ color: textColor }}
      className="text-lg sm:text-xl font-semibold"
     >
      {title}
     </h3>
     <p className={`${color[1]} text-2xl sm:text-3xl font-bold`}>{value}</p>
    </div>
   </div>
  </div>
 );

 const InfoCard = ({ title, children }) => (
  <div
   style={{ backgroundColor: cardBg }}
   className="p-4 sm:p-6 rounded-lg shadow-md"
  >
   <h3
    style={{ color: textColor }}
    className="text-lg sm:text-xl font-semibold mb-3"
   >
    {title}
   </h3>
   <div className="space-y-2">{children}</div>
  </div>
 );

 if (!stats) return null;

 return (
  <div className="space-y-6">
   {/* Stats Section */}
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    <StatCard
     title="Users"
     value={stats.stats.totalUsers}
     icon={<FaUsers size={24} />}
     color={["bg-blue-500", "text-blue-500"]}
    />
    <StatCard
     title="Posts"
     value={stats.stats.totalBlogs}
     icon={<FaBlog size={24} />}
     color={["bg-green-500", "text-green-500"]}
    />
    <StatCard
     title="Comments"
     value={stats.stats.totalComments}
     icon={<FaComments size={24} />}
     color={["bg-purple-500", "text-purple-500"]}
    />
    <StatCard
     title="Admins"
     value={stats.stats.totalAdmins}
     icon={<RiAdminLine size={24} />}
     color={["bg-indigo-500", "text-indigo-500"]}
    />
   </div>

   {/* Recent Users */}
   {stats.recentUsers?.length > 0 && (
    <InfoCard title="Latest Users">
     {stats.recentUsers.map((user) => (
      <Link
       to={`/user/${user.username}`}
       style={{ backgroundColor: cardBgSecondary }}
       key={user._id}
       className="flex items-center justify-between text-sm sm:text-base px-2 py-2 rounded-md"
      >
       <span>{user.username}</span>
       <span className="text-gray-500">{user._id.slice(-4)}</span>
      </Link>
     ))}
    </InfoCard>
   )}

   {/* Recent Blogs */}
   {stats.recentBlogs?.length > 0 && (
    <InfoCard title="Latest Blogs">
     {stats.recentBlogs.map((blog) => (
      <div
       key={blog._id}
       style={{ backgroundColor: cardBgSecondary }}
       className="flex flex-col text-sm sm:text-base pb-2 rounded-md p-2"
      >
       <Link to={`/blog/${blog._id}`} className="font-medium">
        {blog.title}
       </Link>
       <p className="text-gray-500 mt-1">
        By:{" "}
        <Link className="underline" to={`/user/${blog.author?.username}`}>
         {blog.author?.username}
        </Link>
       </p>
      </div>
     ))}
    </InfoCard>
   )}
  </div>
 );
};

export default DashboardStats;
