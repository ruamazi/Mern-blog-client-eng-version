import { useEffect, useState } from "react";
import axios from "axios";
import { FaReply, FaSearch, FaFilter } from "react-icons/fa";
import {
 MdOutlineMarkEmailRead,
 MdOutlinePendingActions,
} from "react-icons/md";
import { useTheme } from "../../context/ThemeContext";
import { apiUrl } from "../../pages/blog/Register";
import Loader from "../blog/Loader";

const AdminMsgs = () => {
 const [messages, setMessages] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const [replyContent, setReplyContent] = useState("");
 const [replyingTo, setReplyingTo] = useState(null);
 const [searchTerm, setSearchTerm] = useState("");
 const [statusFilter, setStatusFilter] = useState("pending");
 const { colors, darkMode: isDark } = useTheme();

 const bgPrimary = isDark
  ? colors.dark.primaryBackground
  : colors.light.primaryBackground;
 const bgSecondary = isDark
  ? colors.dark.secondaryBackground
  : colors.light.secondaryBackground;
 const textPrimary = isDark
  ? colors.dark.primaryColor
  : colors.light.primaryColor;
 const btnPrimary = isDark ? colors.dark.primaryBtn : colors.light.primaryBtn;
 const btnSecondary = isDark
  ? colors.dark.secondaryBtn
  : colors.light.secondaryBtn;

 useEffect(() => {
  fetchMessages();
 }, [statusFilter]);

 const fetchMessages = async () => {
  setLoading(true);
  try {
   const res = await axios.get(
    `${apiUrl}/api/contact/get-msgs-for-admins?status=${statusFilter}`,
    { withCredentials: true }
   );
   // Sort with pending first, then by date (newest first)
   const sortedMessages = res.data.sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
   });
   setMessages(sortedMessages);
  } catch (err) {
   setError(err.response?.data?.error || "Failed to load messages");
  } finally {
   setLoading(false);
  }
 };

 const handleReplySubmit = async (messageId) => {
  if (!replyContent.trim()) {
   setError("Please enter a reply.");
   return;
  }

  try {
   await axios.patch(
    `${apiUrl}/api/contact/reply-to-msg/${messageId}`,
    {
     reply: replyContent,
    },
    { withCredentials: true }
   );
   setReplyContent("");
   setReplyingTo(null);
   fetchMessages(); // Refresh the list
  } catch (err) {
   setError(err.response?.data?.error || "Failed to send reply");
  }
 };

 const markAsClosed = async (messageId) => {
  try {
   await axios.patch(
    `${apiUrl}/api/contact/close-msg/${messageId}`,
    {},
    { withCredentials: true }
   );
   fetchMessages(); // Refresh the list
  } catch (err) {
   setError(err.response?.data?.error || "Failed to mark as closed");
  }
 };

 const filteredMessages = messages.filter((msg) => {
  const matchesSearch =
   msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
   msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
   (msg.adminReply &&
    msg.adminReply.toLowerCase().includes(searchTerm.toLowerCase()));
  return matchesSearch;
 });

 const renderStatusBadge = (status) => {
  const statusConfig = {
   pending: {
    text: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: <MdOutlinePendingActions className="mr-1" />,
   },
   replied: {
    text: "Replied",
    color: "bg-green-100 text-green-800",
    icon: <MdOutlineMarkEmailRead className="mr-1" />,
   },
   closed: {
    text: "Closed",
    color: "bg-blue-100 text-blue-800",
    icon: null,
   },
  };

  return (
   <span
    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${statusConfig[status]?.color}`}
   >
    {statusConfig[status]?.icon}
    {statusConfig[status]?.text}
   </span>
  );
 };

 if (loading) return <Loader />;

 return (
  <div className="min-h-screen p-1 md:p-4">
   <div
    style={{
     backgroundColor: bgSecondary,
    }}
    className="md:p-6 rounded-lg shadow-md mx-auto max-w-6xl"
   >
    <h1
     style={{
      color: textPrimary,
     }}
     className="text-2xl font-bold mb-6"
    >
     Message management
    </h1>

    {/* Filters and Search */}
    <div className="flex flex-col md:flex-row gap-4 mb-6">
     <div className="relative flex-grow">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
       <FaSearch className="text-gray-400" />
      </div>
      <input
       type="text"
       placeholder="Search messages..."
       value={searchTerm}
       onChange={(e) => setSearchTerm(e.target.value)}
       style={{
        backgroundColor: bgPrimary,
       }}
       className="pl-10 w-full px-4 py-2 rounded-lg"
      />
     </div>
     <div className="flex items-center gap-2">
      <FaFilter className="text-gray-400" />
      <select
       value={statusFilter}
       onChange={(e) => setStatusFilter(e.target.value)}
       style={{
        backgroundColor: bgPrimary,
       }}
       className="px-4 py-2 rounded-lg"
      >
       <option value="all">All Messages</option>
       <option value="pending">Not Replied</option>
       <option value="replied">Replied To</option>
       <option value="closed">Closed</option>
      </select>
     </div>
    </div>

    {error && (
     <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700">{error}</div>
    )}

    {/* Messages List */}
    <div className="space-y-4">
     {filteredMessages.length === 0 ? (
      <p className="text-center py-8">No Messages Found</p>
     ) : (
      filteredMessages.map((msg) => (
       <div
        key={msg._id}
        style={{
         backgroundColor: bgPrimary,
         borderColor: isDark
          ? colors.dark.backToHomeBtn
          : colors.light.backToHomeBtn,
        }}
        className="p-4 rounded-lg border"
       >
        <div className="flex justify-between flex-col md:flex-row items-start mb-2">
         <div>
          <h3 className="font-medium">{msg.subject}</h3>
          <p className="text-sm text-gray-500">
           From: {msg.username} ({msg.email})
          </p>
         </div>
         <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-500">
           {new Date(msg.createdAt).toLocaleString()}
          </span>
          {renderStatusBadge(msg.status)}
         </div>
        </div>

        <div className="mb-4">
         <p className="whitespace-pre-line">{msg.message}</p>
        </div>

        {msg.adminReply && (
         <div
          style={{
           backgroundColor: bgSecondary,
          }}
          className="p-3 rounded-lg mb-4"
         >
          <div className="flex justify-between items-center mb-2 ">
           <strong>جواب الأدمن: ({msg.adminId?.username}) </strong>
           {msg.repliedAt && (
            <span className="text-sm text-gray-500">
             {new Date(msg.repliedAt).toLocaleString()}
            </span>
           )}
          </div>
          <p className="whitespace-pre-line overflow-hidden">
           {msg.adminReply}
          </p>
         </div>
        )}

        <div className="flex justify-end gap-2">
         {msg.status !== "closed" && (
          <>
           {msg.status !== "replied" && (
            <button
             onClick={() =>
              setReplyingTo(replyingTo === msg._id ? null : msg._id)
             }
             style={{
              backgroundColor: btnPrimary,
             }}
             className="flex items-center gap-1 text-white px-3 py-1 rounded"
            >
             <FaReply /> Reply
            </button>
           )}
           <button
            onClick={() => markAsClosed(msg._id)}
            style={{
             backgroundColor: btnSecondary,
            }}
            className="text-white px-3 py-1 rounded"
           >
            Mark as Closed
           </button>
          </>
         )}
        </div>

        {replyingTo === msg._id && (
         <div className="mt-4">
          <textarea
           placeholder="Write your reply..."
           value={replyContent}
           onChange={(e) => setReplyContent(e.target.value)}
           rows={4}
           style={{
            backgroundColor: bgSecondary,
           }}
           className="w-full p-3 rounded-lg mb-2 placeholder:text-gray-500"
          />
          <div className="flex justify-end gap-2">
           <button
            onClick={() => setReplyingTo(null)}
            style={{
             backgroundColor: btnSecondary,
            }}
            className="text-white px-3 py-1 rounded"
           >
            Cancel
           </button>
           <button
            onClick={() => handleReplySubmit(msg._id)}
            style={{
             backgroundColor: btnPrimary,
            }}
            className="text-white px-3 py-1 rounded"
           >
            Send Reply
           </button>
          </div>
         </div>
        )}
       </div>
      ))
     )}
    </div>
   </div>
  </div>
 );
};

export default AdminMsgs;
