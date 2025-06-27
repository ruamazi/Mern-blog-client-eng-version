import { useTheme } from "../../context/ThemeContext";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
 const { colors, darkMode: isDark } = useTheme();

 if (!isOpen) return null;

 return (
  <div className="fixed inset-0 flex items-center justify-center z-50">
   <div
    className="fixed inset-0 bg-black/30 backdrop-blur-sm"
    onClick={onClose}
   ></div>
   <div
    style={{
     backgroundColor: isDark
      ? colors.dark.secondaryBackground
      : colors.light.secondaryBackground,
    }}
    className="p-6 rounded-lg shadow-lg z-50"
   >
    <p
     style={{
      color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
     }}
     className="mb-4"
    >
     {message}
    </p>
    <div className="flex justify-end gap-4">
     <button
      onClick={onClose}
      style={{
       backgroundColor: isDark ? colors.dark.grayColor : colors.light.grayColor,
      }}
      className="px-4 py-2  text-white rounded-lg transition duration-200 cursor-pointer 
      opacity-90 hover:opacity-100"
     >
      Cancel
     </button>
     <button
      onClick={onConfirm}
      style={{
       backgroundColor: isDark
        ? colors.dark.tertiaryBtn
        : colors.light.tertiaryBtn,
      }}
      className="px-4 py-2 text-white rounded-lg transition duration-200 cursor-pointer 
      opacity-90 hover:opacity-100"
     >
      Yes, Delete
     </button>
    </div>
   </div>
  </div>
 );
};

export default ConfirmationModal;
