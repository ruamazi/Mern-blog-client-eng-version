import {
 AiFillLike,
 AiFillDislike,
 AiOutlineDislike,
 AiOutlineLike,
} from "react-icons/ai";

const LikeDislikeButtons = ({
 blog,
 likedByCurrentUser,
 dislikedByCurrentUser,
 handleLikeDislike,
 likingLoading,
}) => {
 return (
  <div className="flex items-center justify-center gap-3 w-fit my-4">
   <button
    onClick={() => handleLikeDislike("like")}
    className="relative cursor-pointer text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
    disabled={likingLoading}
   >
    {blog.likedBy.length > 0 && (
     <span className="text-[0.7rem] font-bold absolute left-[-1px] top-[-8px] text-gray-800 dark:text-white">
      {blog.likedBy.length}
     </span>
    )}
    {likedByCurrentUser ? (
     <AiFillLike className="text-blue-500" size={24} />
    ) : (
     <AiOutlineLike size={24} />
    )}
   </button>
   <button
    onClick={() => handleLikeDislike("dislike")}
    className="relative cursor-pointer text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
    disabled={likingLoading}
   >
    {blog.dislikedBy.length > 0 && (
     <span className="text-[0.7rem] font-bold absolute right-[-3px] bottom-[-10px] text-gray-800 dark:text-white">
      {blog.dislikedBy.length}
     </span>
    )}
    {dislikedByCurrentUser ? (
     <AiFillDislike className="text-red-500" size={24} />
    ) : (
     <AiOutlineDislike size={24} />
    )}
   </button>
  </div>
 );
};

export default LikeDislikeButtons;
