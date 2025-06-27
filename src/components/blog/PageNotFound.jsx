import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const PageNotFound = () => {
 const { colors, darkMode: isDark } = useTheme();

 return (
  <div className="flex flex-col items-center justify-center mt-16 gap-2 px-2">
   <img src="/404.svg" alt="not found" width={500} />
   <p
    style={{
     color: isDark ? colors.dark.primaryBtn : colors.light.primaryBtn,
    }}
    className="text-4xl font-bold"
   >
    Page Not Found
   </p>
   <Link to="/" className="hover:underline">
    Back to Home
   </Link>
  </div>
 );
};

export default PageNotFound;
