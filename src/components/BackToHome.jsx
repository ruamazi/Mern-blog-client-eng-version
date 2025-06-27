import { Link } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { useTheme } from "../context/ThemeContext";

const BackToHome = () => {
 const { colors, darkMode: isDark } = useTheme();

 return (
  <Link to={"/"} className="md:hidden mx-auto float-end relative">
   <button
    style={{
     backgroundColor: isDark
      ? colors.dark.backToHomeBtn
      : colors.light.backToHomeBtn,
    }}
    className="opacity-80 hover:opacity-100 text-white px-2 py-1 rounded-lg transition duration-200 cursor-pointer flex
     items-center justify-center gap-1 text-sm absolute -bottom-5 -left-18"
   >
    Home
    <IoMdHome size={17} className="mb-1.5" />
   </button>
  </Link>
 );
};

export default BackToHome;
