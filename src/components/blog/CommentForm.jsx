import { useTheme } from "../../context/ThemeContext";

const CommentForm = ({
 comment,
 setComment,
 handleCommentSubmit,
 commenting,
}) => {
 const { colors, darkMode: isDark } = useTheme();

 return (
  <form onSubmit={handleCommentSubmit} className="mt-6">
   <textarea
    placeholder="Write your comment ..."
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    style={{
     backgroundColor: isDark
      ? colors.dark.primaryBackground
      : colors.light.primaryBackground,
     color: isDark ? colors.dark.primaryText : colors.light.primaryText,
    }}
    className="w-full px-4 py-2 opacity-90 rounded-lg placeholder:text-gray-500"
    rows="3"
    required
   />
   <button
    disabled={commenting}
    type="submit"
    style={{
     backgroundColor: isDark ? colors.dark.primaryBtn : colors.light.primaryBtn,
    }}
    className="mt-2 text-white px-4 py-2 rounded-lg opacity-90 hover:opacity-100 transition duration-200"
   >
    {commenting ? "Commenting..." : "Comment"}
   </button>
  </form>
 );
};

export default CommentForm;
