import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import Loader from "../blog/Loader";
import { apiUrl } from "../../pages/blog/Register";
import axios from "axios";
import Line from "../Line";

const ManageAdmins = () => {
 const [admins, setAdmins] = useState([]);
 const [adminsLoading, setAdminsLoading] = useState(false);
 const [error, setError] = useState("");
 const [websiteData, setWebsiteData] = useState({});
 const [loadingSettings, setLoadingSettings] = useState(false);
 const [saving, setSaving] = useState(false);
 const { colors, darkMode: isDark } = useTheme();

 const getAdmins = async () => {
  setAdminsLoading(true);
  try {
   const resp = await axios.get(`${apiUrl}/api/users/get-admins`, {
    withCredentials: true,
   });
   setAdmins(resp.data);
  } catch (error) {
   console.log(error);
   setError("Faild to get admins");
  } finally {
   setAdminsLoading(false);
  }
 };
 const fetchCurrentSettings = async () => {
  setLoadingSettings(true);
  try {
   const resp = await axios.get(`${apiUrl}/api/admin/webiste-settings`, {
    withCredentials: true,
   });
   setWebsiteData(resp.data);
  } catch (error) {
   console.error(error);
  } finally {
   setLoadingSettings(false);
  }
 };

 const handleRemoveAdminRole = async (adminId) => {
  try {
   await axios.put(
    `${apiUrl}/api/admin/users/${adminId}/role`,
    {},
    {
     withCredentials: true,
    }
   );
   getAdmins();
  } catch (error) {
   console.log(error);
   setError("Faild to remove admin role");
  }
 };

 const handleMakeSuperAdmin = async (adminId) => {
  try {
   await axios.get(`${apiUrl}/api/admin/make-super-admin/${adminId}`, {
    withCredentials: true,
   });
   getAdmins();
  } catch (error) {
   console.log(error);
   setError(error.response.data.error || "Faild to make super admin");
  }
 };

 const handleSavAadminSettings = async (e) => {
  e.preventDefault();
  setSaving(true);
  try {
   const resp = await axios.put(
    `${apiUrl}/api/admin/update-admin-settings`,
    {
     canAdminUpdateWebSettings: websiteData.canAdminUpdateWebSettings,
     canAdminUpdateWebColors: websiteData.canAdminUpdateWebColors,
     canAdminRemoveUsers: websiteData.canAdminRemoveUsers,
    },
    {
     withCredentials: true,
    }
   );
   setWebsiteData(resp.data);
  } catch (error) {
   console.log(error);
   setError("Faild to save admin settings");
  } finally {
   setSaving(false);
  }
 };

 useEffect(() => {
  getAdmins();
  fetchCurrentSettings();
 }, []);

 if (adminsLoading || loadingSettings) return <Loader />;
 if (error) return <h1 className="text-center text-red-500 py-10">{error}</h1>;

 return (
  <div className="w-full max-w-[800px] mx-auto">
   <h2
    style={{
     color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
    }}
    className="text-center text-2xl m-2 mb-5"
   >
    Manage Admins
   </h2>
   <div className="overflow-x-auto ">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 ">
     <thead
      style={{
       backgroundColor: isDark
        ? colors.dark.secondaryBackground
        : colors.light.secondaryBackground,
      }}
     >
      <tr
       style={{
        color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
       }}
      >
       <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium">
        User
       </th>
       <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium hidden sm:table-cell">
        Email
       </th>
       <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium">
        Role
       </th>
       <th className="px-3 py-2 sm:px-6 sm:py-3 text-center text-xs sm:text-sm font-medium">
        Actions
       </th>
      </tr>
     </thead>
     <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
      {admins.map((admin) => (
       <tr
        key={admin._id}
        style={{
         backgroundColor: isDark
          ? colors.dark.secondaryBackground
          : colors.light.secondaryBackground,
        }}
       >
        <td className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm">
         {admin.username}
        </td>
        <td className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm hidden sm:table-cell">
         {admin.email}
        </td>
        <td className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm">
         {admin.role}
        </td>
        <td className="px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm flex justify-end gap-2 flex-wrap">
         {admin.role === "admin" && (
          <button
           onClick={() => handleRemoveAdminRole(admin._id)}
           style={{
            backgroundColor: isDark
             ? colors.dark.tertiaryBtn
             : colors.light.tertiaryBtn,
           }}
           className="opacity-90 hover:opacity-100 text-white px-3 py-1 rounded-md"
          >
           Remove admin role
          </button>
         )}
         {admin.role === "superAdmin" && (
          <button
           onClick={() => handleMakeSuperAdmin(admin._id)}
           style={{
            backgroundColor: isDark
             ? colors.dark.tertiaryBtn
             : colors.light.tertiaryBtn,
           }}
           className="opacity-90 hover:opacity-100 text-white px-3 py-1 rounded-md"
          >
           Remove super admin role
          </button>
         )}
         {admin.role === "admin" && (
          <button
           onClick={() => handleMakeSuperAdmin(admin._id)}
           style={{
            backgroundColor: isDark
             ? colors.dark.primaryBtn
             : colors.light.primaryBtn,
           }}
           className="opacity-90 hover:opacity-100 text-white px-3 py-1 rounded-md"
          >
           Make him admin
          </button>
         )}
        </td>
       </tr>
      ))}
     </tbody>
    </table>
   </div>
   <Line />
   <div className="mt-3">
    <h2
     style={{
      color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
     }}
     className=" text-xl m-2"
    >
     Control admin settings
    </h2>
    <form onSubmit={handleSavAadminSettings}>
     <div className="flex items-center justify-center gap-4 text-center">
      <div
       style={{
        backgroundColor: isDark
         ? colors.dark.primaryBackground
         : colors.light.primaryBackground,
       }}
       className="mb-4 p-1 rounded"
      >
       <label
        style={{
         color: isDark
          ? colors.dark.secondaryColor
          : colors.light.secondaryColor,
        }}
        className="block mb-2"
       >
        Update site settings
       </label>
       <input
        type="checkbox"
        checked={websiteData.canAdminUpdateWebSettings}
        onChange={(e) =>
         setWebsiteData({
          ...websiteData,
          canAdminUpdateWebSettings: e.target.checked,
         })
        }
        className="w-4 h-4 focus:ring-blue-500"
       />
      </div>
      <div
       style={{
        backgroundColor: isDark
         ? colors.dark.primaryBackground
         : colors.light.primaryBackground,
       }}
       className="mb-4 p-1 rounded"
      >
       <label
        style={{
         color: isDark
          ? colors.dark.secondaryColor
          : colors.light.secondaryColor,
        }}
        className="block mb-2"
       >
        Update site colors
       </label>
       <input
        type="checkbox"
        checked={websiteData.canAdminUpdateWebColors}
        onChange={(e) =>
         setWebsiteData({
          ...websiteData,
          canAdminUpdateWebColors: e.target.checked,
         })
        }
        className="w-4 h-4 focus:ring-blue-500"
       />
      </div>
      <div
       style={{
        backgroundColor: isDark
         ? colors.dark.primaryBackground
         : colors.light.primaryBackground,
       }}
       className="mb-4 px-2 py-1 rounded"
      >
       <label
        style={{
         color: isDark
          ? colors.dark.secondaryColor
          : colors.light.secondaryColor,
        }}
        className="block mb-2"
       >
        Can remove users
       </label>
       <input
        type="checkbox"
        checked={websiteData.canAdminRemoveUsers}
        onChange={(e) =>
         setWebsiteData({
          ...websiteData,
          canAdminRemoveUsers: e.target.checked,
         })
        }
        className="w-4 h-4 focus:ring-blue-500"
       />
      </div>
     </div>
     <button
      type="submit"
      style={{
       backgroundColor: isDark
        ? colors.dark.primaryBtn
        : colors.light.primaryBtn,
      }}
      disabled={saving}
      className="opacity-85 hover:opacity-100 text-white py-1 rounded-lg transition duration-200
       btndisabled px-10"
     >
      {saving ? "Saving..." : "Save"}
     </button>
    </form>
   </div>
  </div>
 );
};

export default ManageAdmins;
