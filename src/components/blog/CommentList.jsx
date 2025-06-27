import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useTheme } from "../../context/ThemeContext";
import {
 BiDownvote,
 BiUpvote,
 BiSolidDownvote,
 BiSolidUpvote,
} from "react-icons/bi";
import axios from "axios";
import { apiUrl } from "../../pages/blog/Register";

const CommentList = ({
 comments,
 currentUser,
 deletingComment,
 setShowDeleteCommentModal,
 setCommentToDelete,
 commentsErr,
 setComments,
}) => {
 const [upDownVoting, setUpDownVoting] = useState(false);
 const { colors, darkMode: isDark } = useTheme();
 const navigate = useNavigate();

 const handleUpvote = async (commentId, action) => {
  if (!currentUser) {
   navigate("/login");
   return;
  }
  setUpDownVoting(true);
  try {
   const resp = await axios.get(
    `${apiUrl}/api/comments/${action}-comment/${commentId}`,
    {
     withCredentials: true,
    }
   );
   const updatedComment = resp.data;
   // Update only the targeted comment in state
   setComments((prevComments) =>
    prevComments.map((comment) =>
     comment._id === updatedComment._id ? updatedComment : comment
    )
   );
  } catch (error) {
   console.log(error);
  } finally {
   setUpDownVoting(false);
  }
 };

 if (commentsErr)
  return <p className="text-red-500 text-center">{commentsErr}</p>;

 return (
  <div>
   {comments.map((comment) => (
    <div
     key={comment._id}
     style={{
      backgroundColor: isDark
       ? colors.dark.tertiaryBackground
       : colors.light.tertiaryBackground,
     }}
     className="m-2 p-2 rounded-xl shadow max-w-4xl mx-auto"
    >
     <div className="flex justify-between items-center py-1 mb-2">
      <Link
       to={`/user/${comment.author?.username}`}
       style={{
        backgroundColor: isDark
         ? colors.dark.grayColor
         : colors.light.grayColor,
       }}
       className="flex items-center w-fit pl-1 pr-2 py-[2px] rounded-xl gap-1 rounded-bl-none
       opacity-70 hover:opacity-90 transition-all duration-200"
      >
       <img
        src={comment.author?.profilePicture}
        alt="Author"
        className="w-8 h-8 rounded-full mr-2 object-cover outline-1"
       />
       <span className="text-white">{comment.author?.username}</span>
      </Link>

      <div className="flex items-center gap-1.5 text-sm">
       <button
        onClick={() => handleUpvote(comment._id, "upvote")}
        style={{
         color: isDark ? colors.dark.secondaryBtn : colors.light.secondaryBtn,
        }}
        disabled={upDownVoting}
        className="opacity-70 hover:opacity-80"
       >
        {comment.upVotedBy.includes(currentUser?._id) ? (
         <BiSolidUpvote size={16} className="hover:scale-110" />
        ) : (
         <BiUpvote size={16} className="hover:scale-110" />
        )}
        {comment?.upVotedBy?.length > 0 && (
         <span className="font-bold text-xs">{comment.upVotedBy.length}</span>
        )}
       </button>
       -
       <button
        onClick={() => handleUpvote(comment._id, "downvote")}
        style={{
         color: isDark ? colors.dark.tertiaryBtn : colors.light.tertiaryBtn,
        }}
        disabled={upDownVoting}
        className="opacity-70 hover:opacity-80"
       >
        {comment.downVotedBy.includes(currentUser?._id) ? (
         <BiSolidDownvote size={16} className="hover:scale-110" />
        ) : (
         <BiDownvote size={16} className="hover:scale-110" />
        )}
        {comment?.downVotedBy?.length > 0 && (
         <span className="font-bold text-xs">{comment.downVotedBy.length}</span>
        )}
       </button>
      </div>
     </div>

     <div className="flex items-center justify-between">
      <div className=" ml-3 font-semibold  flex-col flex">
       <p
        style={{
         color: isDark
          ? colors.dark.secondaryColor
          : colors.light.secondaryColor,
        }}
       >
        {comment.content}
       </p>
      </div>

      {currentUser &&
       (currentUser?._id === comment.author._id ||
        currentUser?.role !== "user") && (
        <button
         onClick={() => {
          setCommentToDelete(comment._id);
          setShowDeleteCommentModal(true);
         }}
         disabled={deletingComment}
         style={{
          color: isDark ? colors.dark.tertiaryBtn : colors.light.tertiaryBtn,
         }}
         className="cursor-pointer opacity-70 hover:opacity-85 hover:bg-white/60 dark:hover:bg-white/20 p-1 rounded-full transition-all duration-200"
        >
         <MdOutlineDeleteOutline size={20} />
        </button>
       )}
     </div>
    </div>
   ))}
  </div>
 );
};

export default CommentList;
