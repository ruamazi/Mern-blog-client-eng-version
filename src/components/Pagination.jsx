import { useTheme } from "../context/ThemeContext";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
 const { colors, darkMode: isDark } = useTheme();
 return (
  <>
   {totalPages > 1 && (
    <div className="flex justify-center mt-8">
     {Array.from({ length: totalPages }, (_, i) => (
      <button
       style={
        currentPage === i + 1
         ? {
            backgroundColor: isDark
             ? colors.dark.primaryBtn
             : colors.light.primaryBtn,
           }
         : {
            backgroundColor: isDark
             ? colors.dark.grayColor
             : colors.light.grayColor,
           }
       }
       key={i + 1}
       onClick={() => setCurrentPage(i + 1)}
       className={`mx-1 px-4 py-2 rounded text-white`}
      >
       {i + 1}
      </button>
     ))}
    </div>
   )}
  </>
 );
};

export default Pagination;
