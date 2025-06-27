import { useTheme } from "../context/ThemeContext";

const Line = () => {
 const { colors, darkMode: isDark } = useTheme();

 return (
  <hr
   style={{
    backgroundColor: isDark
     ? colors.dark.backToHomeBtn
     : colors.light.backToHomeBtn,
    opacity: 0.4,
   }}
   className="w-48 h-1 mx-auto my-4 border-0 rounded-sm md:my-10 "
  />
 );
};

export default Line;
