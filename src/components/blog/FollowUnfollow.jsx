import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { apiUrl } from "../../pages/blog/Register";

const FollowUnfollow = ({ userId, setProfileUser }) => {
 const { currentUser } = useAuth();
 const { colors, darkMode: isDark } = useTheme();
 const [isFollowing, setIsFollowing] = useState(false);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 // Check if current user is already following this user
 useEffect(() => {
  if (currentUser && userId) {
   setIsFollowing(currentUser?.following?.includes(userId));
  }
 }, [currentUser, userId]);
 const handleFollowAction = async (userId) => {
  if (!currentUser) return;
  setLoading(true);
  setError(null);

  try {
   await axios.get(`${apiUrl}/api/users/follow-unfollow-user/${userId}`, {
    withCredentials: true,
   });

   // Toggle follow state
   setIsFollowing((prev) => !prev);

   // Update profileUser in one go
   setProfileUser((prevUser) => {
    const isNowFollowing = !isFollowing;

    const updatedFollowers = isNowFollowing
     ? [...prevUser.followers, currentUser._id]
     : prevUser.followers.filter((id) => id !== currentUser._id);
    return {
     ...prevUser,
     followers: updatedFollowers,
    };
   });
  } catch (error) {
   console.error("Error following/unfollowing user:", error);
   setError("An error occurred while following/unfollowing the user.");
  } finally {
   setLoading(false);
  }
 };

 if (!currentUser || currentUser._id === userId) {
  return null;
 }

 return (
  <div className="mt-3">
   <button
    onClick={() => handleFollowAction(userId)}
    disabled={loading}
    style={{
     backgroundColor: isFollowing
      ? isDark
        ? colors.dark.tertiaryBtn
        : colors.light.tertiaryBtn
      : isDark
      ? colors.dark.primaryBtn
      : colors.light.primaryBtn,
     color: "white",
    }}
    className="opacity-90 hover:opacity-100 disabled:opacity-50 w-full px-4 py-2 rounded-lg transition duration-200 text-sm"
   >
    {loading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
   </button>
   {error && (
    <p
     className="text-red-500 text-sm mt-2 text-center"
     style={{
      color: isDark ? colors.dark.tertiaryBtn : colors.light.tertiaryBtn,
     }}
    >
     {error}
    </p>
   )}
  </div>
 );
};

export default FollowUnfollow;
