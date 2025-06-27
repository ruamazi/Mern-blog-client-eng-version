import { useEffect, useState } from "react";
import { apiUrl } from "../../pages/blog/Register";
import axios from "axios";
import Loader from "../blog/Loader";
import WebsiteColor from "./WebsiteColor";
import Line from "../Line";
import { useTheme } from "../../context/ThemeContext";
import { IoReloadOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";

const WebsiteSettings = ({ setWebsiteData, websiteData }) => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [savedSuccessfully, setSavedSuccessfully] = useState(false);
 const { colors, darkMode: isDark } = useTheme();
 const { currentUser } = useAuth();

 const handleResetSettings = async () => {
  setLoading(true);
  try {
   const resp = await axios.get(`${apiUrl}/api/admin/reset-webiste-settings`, {
    withCredentials: true,
   });
   setWebsiteData(resp.data);
  } catch (error) {
   console.error(error);
  } finally {
   setLoading(false);
  }
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setSavedSuccessfully(false);
  setLoading(true);
  setError(null);
  try {
   const resp = await axios.post(
    `${apiUrl}/api/admin/webiste-settings`,
    websiteData,
    {
     withCredentials: true,
    }
   );
   setWebsiteData(resp.data);
   setSavedSuccessfully(true);
  } catch (error) {
   console.error(error);
   setError(error.response.data.error || "An error occurred.");
  } finally {
   setLoading(false);
  }
 };

 if (loading) return <Loader />;

 return (
  <div className="w-full max-w-[800px] mx-auto">
   {currentUser?.role === "admin" &&
   !websiteData.canAdminUpdateWebSettings ? null : (
    <div>
     <h1
      style={{
       color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
      }}
      className="text-center text-2xl m-2 font-bold"
     >
      Update site info
     </h1>
     <form onSubmit={handleSubmit}>
      <div className="mb-4">
       <label
        htmlFor="websiteName"
        style={{
         color: isDark
          ? colors.dark.secondaryColor
          : colors.light.secondaryColor,
        }}
        className="block mb-2"
       >
        Site Name
       </label>
       <input
        type="text"
        id="websiteName"
        placeholder="Write site name ..."
        value={websiteData.websiteName}
        onChange={(e) =>
         setWebsiteData({ ...websiteData, websiteName: e.target.value })
        }
        style={{
         backgroundColor: isDark
          ? colors.dark.primaryBackground
          : colors.light.primaryBackground,
         color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
        }}
        className="w-full px-4 py-2 rounded-lg placeholder:text-gray-400 placeholder:text-sm"
        required
       />
      </div>
      <div className="mb-4">
       <label
        htmlFor="websiteTitle"
        style={{
         color: isDark
          ? colors.dark.secondaryColor
          : colors.light.secondaryColor,
        }}
        className="block mb-2"
       >
        Site Title
       </label>
       <input
        type="text"
        id="websiteTitle"
        placeholder="Write site title ..."
        value={websiteData.websiteTitle}
        onChange={(e) =>
         setWebsiteData({ ...websiteData, websiteTitle: e.target.value })
        }
        style={{
         backgroundColor: isDark
          ? colors.dark.primaryBackground
          : colors.light.primaryBackground,
         color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
        }}
        className="w-full px-4 py-2 rounded-lg placeholder:text-gray-400 placeholder:text-sm"
        required
       />
      </div>
      <div className="mb-4">
       <label
        htmlFor="favicon"
        style={{
         color: isDark
          ? colors.dark.secondaryColor
          : colors.light.secondaryColor,
        }}
        className="block mb-2"
       >
        Favicon
       </label>
       <input
        type="text"
        id="favicon"
        placeholder="URL of favicon"
        value={websiteData.favicon}
        onChange={(e) =>
         setWebsiteData({ ...websiteData, favicon: e.target.value })
        }
        style={{
         backgroundColor: isDark
          ? colors.dark.primaryBackground
          : colors.light.primaryBackground,
         color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
        }}
        className="w-full px-4 py-2 rounded-lg placeholder:text-gray-400 placeholder:text-sm"
        required
       />
      </div>
      <div className="mb-4">
       <label
        htmlFor="websiteLogo"
        style={{
         color: isDark
          ? colors.dark.secondaryColor
          : colors.light.secondaryColor,
        }}
        className="block mb-2"
       >
        Site Logo
       </label>
       <input
        type="text"
        id="websiteLogo"
        placeholder="URL of site logo"
        value={websiteData.websiteLogo}
        onChange={(e) =>
         setWebsiteData({ ...websiteData, websiteLogo: e.target.value })
        }
        style={{
         backgroundColor: isDark
          ? colors.dark.primaryBackground
          : colors.light.primaryBackground,
         color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
        }}
        className="w-full px-4 py-2 rounded-lg placeholder:text-gray-400 placeholder:text-sm"
        required
       />
      </div>
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
         htmlFor="canPublish"
         style={{
          color: isDark
           ? colors.dark.secondaryColor
           : colors.light.secondaryColor,
         }}
         className="block mb-2"
        >
         Can users publish posts?
        </label>
        <input
         type="checkbox"
         id="canPublish"
         checked={websiteData.canPublish}
         onChange={(e) =>
          setWebsiteData({ ...websiteData, canPublish: e.target.checked })
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
         htmlFor="showLogo"
         style={{
          color: isDark
           ? colors.dark.secondaryColor
           : colors.light.secondaryColor,
         }}
         className="block mb-2"
        >
         Logo visible
        </label>
        <input
         type="checkbox"
         id="showLogo"
         checked={websiteData.showLogo}
         onChange={(e) =>
          setWebsiteData({ ...websiteData, showLogo: e.target.checked })
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
         htmlFor="showName"
         style={{
          color: isDark
           ? colors.dark.secondaryColor
           : colors.light.secondaryColor,
         }}
         className="block mb-2"
        >
         Show site name
        </label>
        <input
         type="checkbox"
         id="showName"
         checked={websiteData.showName}
         onChange={(e) =>
          setWebsiteData({ ...websiteData, showName: e.target.checked })
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
       className="opacity-85 hover:opacity-100 text-white px-4 py-2 rounded-lg transition duration-200 btndisabled"
       disabled={loading}
      >
       {loading ? "Saving..." : "Save settings"}
      </button>
      {savedSuccessfully && (
       <p className="text-green-600 mt-2 text-center mb-2">
        Changes saved successfully
       </p>
      )}
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
     </form>
     <button
      onClick={handleResetSettings}
      style={{
       backgroundColor: isDark
        ? colors.dark.primaryBtn
        : colors.light.primaryBtn,
      }}
      className="opacity-85 hover:opacity-100 text-white px-4 py-2 my-2.5 rounded-lg transition duration-200 btndisabled"
      disabled={loading}
     >
      {loading ? "Resetting..." : "Reset default settings"}
     </button>
     <p
      style={{
       color: isDark ? colors.dark.grayColor : colors.light.grayColor,
      }}
      className="text-end text-xs flex justify-end gap-1"
     >
      Reload the page to see the changes
      <span onClick={() => window.location.reload()} className="cursor-pointer">
       <IoReloadOutline />
      </span>
     </p>
    </div>
   )}
   <Line />
   {currentUser?.role === "admin" &&
   !websiteData.canAdminUpdateWebColors ? null : (
    <WebsiteColor />
   )}
  </div>
 );
};

export default WebsiteSettings;
