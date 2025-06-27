import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const StatItem = ({ label, value, isLink = false, to = "#" }) => {
 const { colors, darkMode: isDark } = useTheme();
 return (
  <div
   style={{
    color: isDark ? colors.dark.secondaryColor : colors.light.secondaryColor,
   }}
   className="py-2 flex justify-between items-center text-sm"
  >
   <span className="font-semibold">{label}:</span>
   {isLink ? (
    <Link
     to={to}
     style={{
      color: isDark ? colors.dark.primaryBtn : colors.light.primaryBtn,
     }}
     className="opacity-70 hover:opacity-100 transition duration-200 truncate ml-2"
     title={value}
    >
     {value.substring(0, 20)}...
    </Link>
   ) : (
    <span className="ml-2">{value}</span>
   )}
  </div>
 );
};

export default StatItem;
