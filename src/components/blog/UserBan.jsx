import { useState } from "react";
import axios from "axios";
import { VscLock, VscUnlock } from "react-icons/vsc";
import { FaRegEdit } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { apiUrl } from "../../pages/blog/Register";

const UserBan = ({ profileUser, currentUser, onBanUpdate }) => {
 const { colors, darkMode: isDark } = useTheme();
 const [editing, setEditing] = useState({
  canPublish: false,
  canComment: false,
  canChangePicture: false,
 });
 const [banReasons, setBanReasons] = useState({
  canPublish: profileUser.canPublish.reason,
  canComment: profileUser.canComment.reason,
  canChangePicture: profileUser.canChangePicture.reason,
 });
 const [banPeriods, setBanPeriods] = useState({
  canPublish: profileUser.canPublish.period,
  canComment: profileUser.canComment.period,
  canChangePicture: profileUser.canChangePicture.period,
 });
 const [isUpdating, setIsUpdating] = useState(false);
 const [showBanConfirmation, setShowBanConfirmation] = useState(null);
 const [tempBanReason, setTempBanReason] = useState("");
 const [tempBanPeriod, setTempBanPeriod] = useState("day");

 const periodOptions = [
  { value: "day", label: "day" },
  { value: "week", label: "week" },
  { value: "month", label: "month" },
  { value: "year", label: "year" },
 ];

 const canModifyBans =
  currentUser?.role === "superAdmin" ||
  (currentUser?.role === "admin" && profileUser.role === "user");

 const handleBanToggle = async (banType) => {
  if (!canModifyBans) return;

  if (profileUser[banType].status === false) {
   // Unban - no reason needed
   setIsUpdating(true);
   try {
    const updateData = {
     [banType]: {
      status: true,
      reason: "",
      date: null,
      period: "day",
     },
    };
    const resp = await axios.put(
     `${apiUrl}/api/users/update-ban/${profileUser._id}`,
     updateData,
     { withCredentials: true }
    );
    onBanUpdate(resp.data);
   } catch (error) {
    console.error(`Error updating ${banType} ban:`, error);
   } finally {
    setIsUpdating(false);
   }
  } else {
   // Show ban confirmation with reason and period
   setShowBanConfirmation(banType);
   setTempBanReason(banReasons[banType] || "");
   setTempBanPeriod(banPeriods[banType] || "day");
  }
 };

 const confirmBan = async (banType) => {
  if (!tempBanReason.trim()) {
   alert("Please provide a reason for the ban.");
   return;
  }

  setIsUpdating(true);
  try {
   const updateData = {
    [banType]: {
     status: false,
     reason: tempBanReason,
     date: new Date(),
     period: tempBanPeriod,
    },
   };
   const resp = await axios.put(
    `${apiUrl}/api/users/update-ban/${profileUser._id}`,
    updateData,
    { withCredentials: true }
   );
   onBanUpdate(resp.data);
   setBanReasons({ ...banReasons, [banType]: tempBanReason });
   setBanPeriods({ ...banPeriods, [banType]: tempBanPeriod });
   setShowBanConfirmation(null);
  } catch (error) {
   console.error(`Error updating ${banType} ban:`, error);
  } finally {
   setIsUpdating(false);
  }
 };

 const handleReasonChange = (banType, value) => {
  setBanReasons({ ...banReasons, [banType]: value });
 };

 const handlePeriodChange = (banType, value) => {
  setBanPeriods({ ...banPeriods, [banType]: value });
 };

 const renderBanControl = (banType, label) => {
  const isBanned = !profileUser[banType].status;
  const banDate = profileUser[banType].date
   ? new Date(profileUser[banType].date).toLocaleDateString()
   : null;

  const saveBanChanges = async (banType) => {
   setIsUpdating(true);
   try {
    const updateData = {
     [banType]: {
      status: profileUser[banType].status, // Keep current status
      reason: banReasons[banType] || "",
      date: profileUser[banType].date, // Keep current date
      period: banPeriods[banType] || "day",
     },
    };
    const resp = await axios.put(
     `${apiUrl}/api/users/update-ban/${profileUser._id}`,
     updateData,
     { withCredentials: true }
    );
    onBanUpdate(resp.data);
    setEditing({ ...editing, [banType]: false });
   } catch (error) {
    console.error(`Error updating ${banType} ban:`, error);
   } finally {
    setIsUpdating(false);
   }
  };
  const toggleEdit = (banType) => {
   if (editing[banType]) {
    // When saving, send the update
    saveBanChanges(banType);
   } else {
    // When starting to edit, just toggle the state
    setEditing({ ...editing, [banType]: true });
   }
  };

  return (
   <div
    className={`p-3 rounded-lg mb-3 `}
    style={{
     borderLeft: `4px solid ${
      isBanned
       ? isDark
         ? colors.dark.tertiaryBtn
         : colors.light.tertiaryBtn
       : isDark
       ? colors.dark.secondaryBtn
       : colors.light.secondaryBtn
     }`,
     backgroundColor: isDark
      ? colors.dark.primaryBackground
      : colors.light.primaryBackground,
    }}
   >
    {showBanConfirmation === banType && (
     <div className="mb-3 p-3 rounded bg-red-100 dark:bg-red-900/30">
      <h4 className="font-medium mb-2 text-red-700 dark:text-red-300">
       Ban settings for {label}
      </h4>
      <div className="mb-2">
       <label className="block text-start text-sm mb-1">Ban Reason:</label>
       <input
        type="text"
        value={tempBanReason}
        onChange={(e) => setTempBanReason(e.target.value)}
        placeholder="Enter ban reason"
        className={`w-full p-2 rounded text-sm ${
         isDark ? "bg-gray-700 text-white" : "bg-white text-gray-800"
        }`}
       />
      </div>
      <div className="mb-3">
       <label className="block text-start text-sm mb-1">Ban Period:</label>
       <select
        value={tempBanPeriod}
        onChange={(e) => setTempBanPeriod(e.target.value)}
        className={`w-full p-2 rounded text-sm ${
         isDark ? "bg-gray-700 text-white" : "bg-white text-gray-800"
        }`}
       >
        {periodOptions.map((option) => (
         <option key={option.value} value={option.value}>
          {option.label}
         </option>
        ))}
       </select>
      </div>
      <div className="flex gap-2">
       <button
        onClick={() => confirmBan(banType)}
        disabled={isUpdating}
        className={`px-3 py-1 rounded text-sm flex-1 ${
         isDark ? "bg-red-700 hover:bg-red-600" : "bg-red-600 hover:bg-red-500"
        } text-white`}
       >
        {isUpdating ? "applying..." : "confirm"}
       </button>
       <button
        onClick={() => setShowBanConfirmation(null)}
        className="px-3 py-1 rounded text-sm flex-1 bg-gray-500 text-white"
       >
        cancel
       </button>
      </div>
     </div>
    )}

    <div className="flex justify-between items-center w-full gap-1">
     <div className="flex items-center gap-2">
      {isBanned ? (
       <VscLock
        className={`${isDark ? "text-red-400" : "text-red-600"}`}
        size={18}
       />
      ) : (
       <VscUnlock
        className={`${isDark ? "text-green-400" : "text-green-600"}`}
        size={18}
       />
      )}
      <span className="font-medium">{label}</span>
     </div>

     {canModifyBans && (
      <button
       onClick={() => handleBanToggle(banType)}
       disabled={isUpdating || showBanConfirmation === banType}
       className={`px-3 py-1 rounded text-sm ${
        isBanned
         ? `${
            isDark
             ? "bg-green-700 hover:bg-green-600"
             : "bg-green-600 hover:bg-green-500"
           } text-white`
         : `${
            isDark
             ? "bg-red-700 hover:bg-red-600"
             : "bg-red-600 hover:bg-red-500"
           } text-white`
       }`}
      >
       {isUpdating ? "applying..." : isBanned ? "unban" : "ban"}
      </button>
     )}
    </div>

    {(isBanned || editing[banType]) && (
     <div className="mt-2">
      {editing[banType] ? (
       <div className="space-y-2">
        <div className="flex gap-2">
         <input
          type="text"
          value={banReasons[banType]}
          onChange={(e) => handleReasonChange(banType, e.target.value)}
          placeholder="Reason for ban"
          className={`flex-1 p-2 rounded text-sm ${
           isDark ? "bg-gray-700 text-white" : "bg-white text-gray-800"
          }`}
         />
         <button
          onClick={() => toggleEdit(banType)}
          className="px-2 py-1 bg-gray-500 text-white rounded text-sm"
         >
          {isUpdating ? "saving..." : "save"}
         </button>
        </div>
        <select
         value={banPeriods[banType]}
         onChange={(e) => handlePeriodChange(banType, e.target.value)}
         className={`w-full p-2 rounded text-sm ${
          isDark ? "bg-gray-700 text-white" : "bg-white text-gray-800"
         }`}
        >
         {periodOptions.map((option) => (
          <option key={option.value} value={option.value}>
           {option.label}
          </option>
         ))}
        </select>
       </div>
      ) : (
       <div className="space-y-1">
        <div className="flex justify-between items-center text-sm">
         <div>
          <span className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
           {profileUser[banType].reason || "No reason provided"}
          </span>
          {banDate && (
           <span
            className={`block text-xs ${
             isDark ? "text-gray-500" : "text-gray-400"
            }`}
           >
            Since: {banDate}
           </span>
          )}
         </div>
         {canModifyBans && (
          <button
           onClick={() => toggleEdit(banType)}
           className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
           <FaRegEdit size={14} />
          </button>
         )}
        </div>
        <div className="text-xs">
         <span className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Period:{" "}
          {periodOptions.find((o) => o.value === profileUser[banType].period)
           ?.label || "day"}
         </span>
        </div>
       </div>
      )}
     </div>
    )}
   </div>
  );
 };

 if (
  !canModifyBans &&
  profileUser.canPublish.status &&
  profileUser.canComment.status &&
  profileUser.canChangePicture.status
 ) {
  return null;
 }

 return (
  <div
   className={`m-3 p-2 md:p-6 rounded-lg shadow-md ${
    isDark ? "bg-gray-800" : "bg-white"
   } border w-[100%]`}
   style={{
    borderTop: `3px solid ${
     isDark ? colors.dark.tertiaryBtn : colors.light.tertiaryBtn
    }`,
   }}
  >
   <h3
    className={`text-lg font-bold mb-4 ${
     isDark ? "text-red-300" : "text-red-600"
    }`}
   >
    Restrictions settings
   </h3>

   {renderBanControl("canPublish", "Publishing")}
   {renderBanControl("canComment", "Commenting")}
   {renderBanControl("canChangePicture", "Changing Profile Picture")}

   <p className={`text-xs mt-5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
    Note: These restrictions only affect user capabilities and do not prevent
    login.
   </p>
  </div>
 );
};

export default UserBan;
