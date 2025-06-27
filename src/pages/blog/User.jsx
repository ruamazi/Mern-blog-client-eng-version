import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import Link
import Loader from "../../components/blog/Loader";
import axios from "axios";
import { apiUrl } from "./Register";
import { useAuth } from "../../context/AuthContext";
import PageNotFound from "../../components/blog/PageNotFound";
import BackToHome from "../../components/BackToHome";
import { useTheme } from "../../context/ThemeContext";
import UserBlogs from "../../components/blog/UserBlogs";
import UserStats from "../../components/blog/UserStats";
import { VscVerifiedFilled, VscUnverified } from "react-icons/vsc";
import UserBan from "../../components/blog/UserBan";
import ConfirmationModal from "../../components/blog/ConfirmationModal";
import FollowUnfollow from "../../components/blog/FollowUnfollow";
import UserFavorites from "../../components/blog/UserFavorites";

const User = ({ canAdminDeleteUser }) => {
 const { username } = useParams();
 const [profileUser, setProfileUser] = useState(null);
 const [loadingUser, setLoadingUser] = useState(true);
 const [deletingUser, setDeletingUser] = useState(false);
 const [banUpdated, setBanUpdated] = useState(false);
 const [showModal, setShowModal] = useState({
  status: false,
  userId: null,
 });
 const { currentUser } = useAuth();
 const navigate = useNavigate();
 const { colors, darkMode: isDark } = useTheme();

 const bgMain = isDark
  ? colors.dark.secondaryBackground
  : colors.light.secondaryBackground;
 const textMain = isDark ? colors.dark.primaryColor : colors.light.primaryColor;

 const blueColor = isDark ? colors.dark.primaryBtn : colors.light.primaryBtn;
 const greenColor = isDark
  ? colors.dark.secondaryBtn
  : colors.light.secondaryBtn;

 // Fetch user profile data
 const getUser = async () => {
  setLoadingUser(true);
  setProfileUser(null); // Reset user on username change
  try {
   const resp = await axios.get(`${apiUrl}/api/users/user/${username}`);
   setProfileUser(resp.data);
  } catch (error) {
   console.error("Error fetching user profile:", error);
   setProfileUser(null); // Ensure profileUser is null on error
  } finally {
   setLoadingUser(false);
  }
 };

 // Handle making user admin/removing admin role
 const handleAdmin = async (userId) => {
  try {
   const resp = await axios.put(
    `${apiUrl}/api/users/change-role/${userId}`,
    {},
    {
     withCredentials: true,
    }
   );
   setProfileUser(resp.data); // Update profileUser state with new role
  } catch (error) {
   console.error("Error changing user role:", error);
  }
 };

 // Handle deleting a user
 const handleDeleteUser = async (userId) => {
  setDeletingUser(true);
  try {
   await axios.delete(`${apiUrl}/api/users/delete-user/${userId}`, {
    withCredentials: true,
   });
   navigate("/"); // Navigate away after deletion
  } catch (error) {
   console.error("Error deleting user:", error);
   // Add user feedback here (e.g., toast notification)
  } finally {
   setDeletingUser(false);
   setShowModal(() => ({ status: false, userId: null }));
  }
 };

 // Effect to fetch user profile when username changes
 useEffect(() => {
  document.title = `@${username}`;
  getUser();
 }, [username]);

 useEffect(() => {
  if (banUpdated) {
   getUser();
   setBanUpdated(false);
  }
 }, [banUpdated]);

 if (loadingUser) return <Loader />;
 // If loading finished but no profileUser found (e.g., 404 error)
 if (!profileUser) return <PageNotFound />;

 return (
  <>
   <div
    style={{
     backgroundColor: bgMain,
     color: textMain,
    }}
    className="p-4 md:p-6 rounded-lg shadow-md mt-5 max-w-4xl mx-auto"
   >
    <div className="flex flex-col md:flex-row gap-6">
     {/* Left Side: Profile Info & Actions */}
     <div className="flex flex-col items-center justify-center md:items-start md:w-1/3">
      {/* Profile Picture */}
      <img
       src={profileUser.profilePicture}
       alt={`${profileUser.username}'s Profile`}
       className={`w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 mb-3 ${
        profileUser?.role === "superAdmin"
         ? "border-amber-500"
         : isDark
         ? "border-gray-600"
         : "border-gray-300" // Consistent border
       }`}
      />
      {/* Username */}
      <h2 className="text-2xl font-bold mt-2 text-center md:text-left">
       {profileUser.username}
      </h2>
      {/* Email */}
      <h3
       style={{
        color: isDark ? colors.dark.grayColor : colors.light.grayColor,
       }}
       className="flex gap-1 text-sm mb-3 text-center md:text-left"
      >
       {profileUser.email}
       {profileUser.emailVerified ? (
        <VscVerifiedFilled
         style={{
          color: isDark ? colors.dark.secondaryBtn : colors.light.secondaryBtn,
         }}
         className="text-green-500 opacity-70 mb-1"
        />
       ) : (
        <VscUnverified
         style={{
          color: isDark ? colors.dark.tertiaryBtn : colors.light.tertiaryBtn,
         }}
         size={18}
         className="text-red-500 opacity-70 mb-1"
        />
       )}
      </h3>
      <span
       className={`text-lg font-semibold px-3 py-1 rounded ${
        profileUser?.role === "superAdmin"
         ? "text-amber-500 bg-amber-100 dark:bg-amber-900/50"
         : profileUser?.role === "admin"
         ? "text-blue-500 bg-blue-100 dark:bg-blue-900/50"
         : ""
       }`}
      >
       {profileUser?.role === "superAdmin"
        ? "Super Admin"
        : profileUser?.role === "admin"
        ? "Admin"
        : null}
      </span>
      {/* Followers / Following Stats */}
      <div className="flex gap-2 mt-4 text-sm text-center md:text-left">
       <p
        style={{
         borderColor: greenColor,
        }}
        className="flex gap-1 items-center border-t border-b px-2 py-1 rounded"
       >
        <span className="">{profileUser.followers?.length || 0}</span>
        Followers
       </p>
       <p
        style={{
         borderColor: blueColor,
        }}
        className="flex gap-1 items-center border-t border-b px-2 py-1 rounded"
       >
        Following
        <span>{profileUser.following?.length || 0}</span>
       </p>
      </div>
      <FollowUnfollow
       userId={profileUser?._id}
       setProfileUser={setProfileUser}
      />
     </div>

     {/* Right Side: User Stats */}
     <UserStats profileUser={profileUser} userId={profileUser._id} />
    </div>
   </div>
   {/* Admin Actions */}
   <div
    className="flex flex-col max-w-md mx-auto w-full px-4 items-center md:items-start 
   gap-2 text-center py-5"
   >
    {/* user ban */}
    {currentUser?.role !== "user" && profileUser?.role === "user" && (
     <UserBan
      profileUser={profileUser}
      currentUser={currentUser}
      onBanUpdate={() => setBanUpdated(true)}
     />
    )}
    {/* Change Role Button */}
    {currentUser &&
     profileUser._id !== currentUser._id && // Don't show for self
     profileUser.role !== "superAdmin" &&
     currentUser?.role !== "user" && ( // SuperAdmin and Admins can change roles
      <button
       onClick={() => handleAdmin(profileUser._id)}
       style={{
        backgroundColor: isDark
         ? colors.dark.primaryBtn
         : colors.light.primaryBtn,
       }}
       className="text-white opacity-90 hover:opacity-100 w-full px-4 py-2 mt-2 rounded-lg transition duration-200 text-sm"
      >
       {profileUser.role === "user" ? "Make User Admin" : "Remove Admin Role"}
      </button>
     )}
    {/* Delete User Button */}
    {profileUser.role !== "superAdmin" && // SuperAdmin cannot be deleted
     (currentUser?.role === "superAdmin" ||
      (currentUser?.role === "admin" && canAdminDeleteUser)) && (
      <button
       onClick={() =>
        setShowModal(() => ({ status: true, userId: profileUser._id }))
       }
       disabled={deletingUser}
       style={{
        backgroundColor: isDark
         ? colors.dark.tertiaryBtn
         : colors.light.tertiaryBtn,
       }}
       className="opacity-90 hover:opacity-100 disabled:opacity-50 w-full text-white px-4 py-2 rounded-lg transition duration-200 text-sm"
      >
       {deletingUser ? "Deleting..." : "Delete User"}
      </button>
     )}
   </div>
   {/* User Blogs Section (Unchanged) */}
   {profileUser?._id && (
    <UserBlogs userId={profileUser._id} username={profileUser.username} />
   )}
   {profileUser?._id && (
    <UserFavorites
     userId={profileUser._id}
     showFavState={profileUser?.showFavorites}
    />
   )}
   <BackToHome />
   <ConfirmationModal
    isOpen={showModal.status}
    onClose={() => setShowModal(() => ({ status: false, userId: null }))}
    onConfirm={() => handleDeleteUser(showModal.userId)}
    message="Are you sure you want to delete this user?"
   />
  </>
 );
};

export default User;
