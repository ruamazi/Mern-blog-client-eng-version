import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../pages/blog/Register";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import Loader from "./blog/Loader";
import { useEffect, useState } from "react";

const UserMsgs = () => {
 const { currentUser } = useAuth();
 const [userMessages, setUserMessages] = useState([]);
 const [error, setError] = useState("");
 const [loadingMessages, setLoadingMessages] = useState(false);
 const { colors, darkMode: isDark } = useTheme();

 const getMsgsForUsers = async () => {
  setError("");
  setLoadingMessages(true);
  try {
   const resp = await axios.get(`${apiUrl}/api/contact/get-msgs-for-users`, {
    withCredentials: true,
   });
   setUserMessages(resp.data);
  } catch (error) {
   console.log(error);
   setError(error.response.data.message || "something went wrong");
  } finally {
   setLoadingMessages(false);
  }
 };

 useEffect(() => {
  if (!currentUser) return;
  getMsgsForUsers();
 }, []);

 const renderStatusBadge = (status) => {
  const statusColors = {
   pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
   replied: { bg: "bg-green-100", text: "text-green-800" },
   closed: { bg: "bg-blue-100", text: "text-blue-800" },
  };

  const statusText = {
   pending: "pending",
   replied: "replied",
   closed: "closed",
  };

  return (
   <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]?.bg} ${statusColors[status]?.text}`}
   >
    {statusText[status] || status}
   </span>
  );
 };

 if (!currentUser) return null;
 if (loadingMessages) return <Loader />;
 if (error) return <p className="text-red-500 text-center py-6">{error}</p>;

 return (
  <div
   style={{
    backgroundColor: isDark
     ? colors.dark.secondaryBackground
     : colors.light.secondaryBackground,
   }}
   className="p-6 rounded-lg shadow-md mx-auto max-w-[750px]"
  >
   <div className="flex items-center gap-2 mb-4">
    <h2
     style={{
      color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
     }}
     className="text-xl font-bold"
    >
     Your previous messages
    </h2>
   </div>

   {loadingMessages ? (
    <Loader />
   ) : userMessages.length === 0 ? (
    <p
     style={{
      color: isDark ? colors.dark.textColor : colors.light.textColor,
     }}
    >
     There are no previous messages.
    </p>
   ) : (
    <div className="space-y-4">
     {userMessages.map((msg) => (
      <div
       key={msg._id}
       style={{
        backgroundColor: isDark
         ? colors.dark.primaryBackground
         : colors.light.primaryBackground,
        borderColor: isDark
         ? colors.dark.borderColor
         : colors.light.borderColor,
       }}
       className="p-4 rounded-lg border"
      >
       <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{msg.subject}</h3>
        <div className="flex items-center gap-2">
         <span className="text-sm text-gray-500">
          {new Date(msg.createdAt).toLocaleDateString()}
         </span>
         {renderStatusBadge(msg.status)}
        </div>
       </div>
       <p className="mb-3">{msg.message}</p>

       {msg.adminReply && (
        <div
         style={{
          backgroundColor: isDark
           ? colors.dark.secondaryBackground
           : colors.light.secondaryBackground,
         }}
         className="p-3 rounded-lg mt-3"
        >
         <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">Moderator's reply:</span>
          {msg.repliedAt && (
           <span className="text-sm text-gray-500">
            {new Date(msg.repliedAt).toLocaleDateString()}
           </span>
          )}
         </div>
         <p>{msg.adminReply}</p>
        </div>
       )}
      </div>
     ))}
    </div>
   )}
  </div>
 );
};

export default UserMsgs;
