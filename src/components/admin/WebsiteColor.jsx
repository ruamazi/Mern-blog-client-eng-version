import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const WebsiteColor = () => {
 const {
  colors,
  updateColors,
  resetColors,
  darkMode: isDark,
  saveColorsToDB,
 } = useTheme();
 const [saving, setSaving] = useState(false);
 const [savingMsg, setSavingMsg] = useState({ error: "", message: "" });

 const renderColorInput = (theme, property, label) => (
  <div className="flex items-center gap-4 py-2 border-b border-gray-200">
   <label
    style={{
     color: isDark ? colors.dark.secondaryColor : colors.light.secondaryColor,
    }}
    className="w-48 font-medium"
   >
    {label}
   </label>
   <input
    type="color"
    value={colors[theme][property]}
    onChange={(e) => updateColors(theme, property, e.target.value)}
    className="h-10 w-10 cursor-pointer"
   />
   <span className="hidden md:inline font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
    {colors[theme][property]}
   </span>
  </div>
 );

 const handleSave = async () => {
  setSaving(true);
  setSavingMsg({ error: "", message: "" });
  try {
   const resp = await saveColorsToDB();
   if (resp.error) {
    setSavingMsg((prev) => ({ ...prev, error: resp.error }));
   }
   setSavingMsg((prev) => ({ ...prev, message: resp.message }));
  } catch (error) {
   console.error("Failed to save colors:", error);
   setSavingMsg((prev) => ({
    ...prev,
    error: "An error occurred while saving colors.",
   }));
  } finally {
   setSaving(false);
  }
 };

 const handleReset = async () => {
  setSavingMsg({ error: "", message: "" });
  try {
   const resp = await resetColors();
   if (resp.error) {
    setSavingMsg((prev) => ({ ...prev, error: resp.error }));
   }
   setSavingMsg((prev) => ({ ...prev, message: resp.message }));
  } catch (error) {
   setSavingMsg((prev) => ({
    ...prev,
    error: "An error occurred while resetting colors.",
   }));
  }
 };

 return (
  <div className="p-6 max-w-4xl mx-auto">
   <h1
    style={{
     color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
    }}
    className="text-2xl font-bold text-center mb-8"
   >
    Site color settings
   </h1>

   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Dark Theme */}
    <div className=" p-5 rounded-lg shadow">
     <h3
      style={{
       color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
      }}
      className="text-lg font-bold mb-4 pb-2 border-b border-gray-300"
     >
      Dark Theme
     </h3>

     {renderColorInput("dark", "primaryBackground", "Background Main")}
     {renderColorInput("dark", "secondaryBackground", "Secondary Background")}
     {renderColorInput("dark", "tertiaryBackground", "Comments Background")}
     {renderColorInput("dark", "primaryColor", "Text Primary Color")}
     {renderColorInput("dark", "secondaryColor", "Text Secondary Color")}
     {renderColorInput("dark", "primaryBtn", "Main Button Color")}
     {renderColorInput("dark", "secondaryBtn", "Secondary Button")}
     {renderColorInput("dark", "tertiaryBtn", "Red Button")}
     {renderColorInput("dark", "quaternaryBtn", "Golden Button")}
     {renderColorInput("dark", "backToHomeBtn", "Back to home button")}
     {renderColorInput("dark", "grayColor", "Gray Color")}
    </div>

    {/* Light Theme */}
    <div className=" p-5 rounded-lg shadow">
     <h3
      style={{
       color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
      }}
      className="text-lg font-bold mb-4 pb-2 border-b border-gray-300"
     >
      Light Theme
     </h3>

     {renderColorInput("light", "primaryBackground", "Background Main")}
     {renderColorInput("light", "secondaryBackground", "Secondary Background")}
     {renderColorInput("light", "tertiaryBackground", "Comments Background")}
     {renderColorInput("light", "primaryColor", "Text Primary Color")}
     {renderColorInput("light", "secondaryColor", "Text Secondary Color")}
     {renderColorInput("light", "primaryBtn", "Main Button Color")}
     {renderColorInput("light", "secondaryBtn", "Secondary Button")}
     {renderColorInput("light", "tertiaryBtn", "Red Button")}
     {renderColorInput("light", "quaternaryBtn", "Golden Button")}
     {renderColorInput("light", "backToHomeBtn", "Back to home button")}
     {renderColorInput("light", "grayColor", "Gray Color")}
    </div>
   </div>
   <p
    style={{
     color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
    }}
    className="text-center mt-2 text-xs"
   >
    Changes will not be saved to the database until you click the Save Changes
    button.
   </p>
   <div className="flex gap-3 flex-wrap mt-6 text-center">
    <button
     onClick={handleSave}
     disabled={saving}
     style={{
      backgroundColor: isDark
       ? colors.dark.primaryBtn
       : colors.light.primaryBtn,
     }}
     className="opacity-85 hover:opacity-100 text-white py-2 px-6 rounded-lg transition-all duration-200 btndisabled"
    >
     {saving ? "Saving..." : "Save Changes"}
    </button>
    <button
     onClick={handleReset}
     style={{
      backgroundColor: isDark ? colors.dark.grayColor : colors.light.grayColor,
     }}
     className="opacity-80 hover:opacity-100 text-white py-2 px-6 rounded-lg transition-all duration-200"
    >
     Reset
    </button>
   </div>
   {savingMsg.error && (
    <p className="text-center pt-4 text-sm text-red-500">{savingMsg.error}</p>
   )}
   {savingMsg.message && (
    <p className="text-center pt-4 text-sm text-green-500">
     {savingMsg.message}
    </p>
   )}
  </div>
 );
};

export default WebsiteColor;
