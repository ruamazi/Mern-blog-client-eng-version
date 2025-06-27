import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../pages/blog/Register";
import DashboardStats from "../../components/admin/DashboardStats";
import UsersList from "../../components/admin/UsersList";
import BlogsList from "../../components/admin/BlogsList";
import Loader from "../../components/blog/Loader";
import BackToHome from "../../components/BackToHome";
import WebsiteSettings from "../../components/admin/WebsiteSettings";
import { useTheme } from "../../context/ThemeContext";
import ManageAdmins from "../../components/admin/ManageAdmins";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminMsgs from "../../components/admin/AdminMsgs";

const Dashboard = () => {
 const [stats, setStats] = useState(null);
 const [activeTab, setActiveTab] = useState("stats");
 const [loading, setLoading] = useState(false);
 const [loadingSettings, setLoadingSettings] = useState(false);
 const [websiteData, setWebsiteData] = useState({
  websiteName: "",
  websiteTitle: "",
  favicon: "",
  websiteLogo: "",
  canPublish: true,
  showLogo: false,
  showName: true,
 });
 const { colors, darkMode: isDark } = useTheme();
 const { currentUser } = useAuth();
 const navigate = useNavigate();

 useEffect(() => {
  if (!currentUser || currentUser?.role === "user") {
   navigate("/");
  }
 }, []);

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

 const fetchDashboardStats = async () => {
  setLoading(true);
  try {
   const response = await axios.get(`${apiUrl}/api/admin/stats`, {
    withCredentials: true,
   });
   setStats(response.data);
  } catch (error) {
   console.error(error);
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  document.title = "Control Panel";
  fetchDashboardStats();
  fetchCurrentSettings();
 }, []);

 if (loading || loadingSettings) return <Loader />;

 return (
  <>
   <div
    style={{
     backgroundColor: isDark
      ? colors.dark.primaryBackground
      : colors.light.primaryBackground,
    }}
    className=" md:p-4 sm:p-6 min-h-screen mb-5"
   >
    <h1
     style={{
      color: isDark ? colors.dark.primaryColor : colors.light.primaryColor,
     }}
     className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6"
    >
     Control Panel
    </h1>
    <div className="mb-4 sm:mb-6">
     <div className="flex flex-wrap gap-2 sm:gap-4">
      <button
       onClick={() => setActiveTab("stats")}
       style={{
        backgroundColor:
         activeTab === "stats" ? colors.dark.primaryBtn : colors.dark.grayColor,
       }}
       className={`${
        activeTab !== "stats" && "opacity-80"
       } hover:opacity-100 px-3 text-white py-1.5 sm:px-4 sm:py-2 rounded text-sm sm:text-base`}
      >
       Stats
      </button>
      <button
       onClick={() => setActiveTab("users")}
       style={{
        backgroundColor:
         activeTab === "users" ? colors.dark.primaryBtn : colors.dark.grayColor,
       }}
       className={`${
        activeTab !== "users" && "opacity-80"
       } hover:opacity-100 px-3 text-white py-1.5 sm:px-4 sm:py-2 rounded text-sm sm:text-base`}
      >
       Users
      </button>
      <button
       onClick={() => setActiveTab("blogs")}
       style={{
        backgroundColor:
         activeTab === "blogs" ? colors.dark.primaryBtn : colors.dark.grayColor,
       }}
       className={`${
        activeTab !== "blogs" && "opacity-80"
       } hover:opacity-100 px-3 text-white py-1.5 sm:px-4 sm:py-2 rounded text-sm sm:text-base`}
      >
       Posts
      </button>
      <button
       onClick={() => setActiveTab("settings")}
       style={{
        backgroundColor:
         activeTab === "settings"
          ? colors.dark.primaryBtn
          : colors.dark.grayColor,
       }}
       className={`${
        activeTab !== "settings" && "opacity-80"
       } hover:opacity-100 px-3 text-white py-1.5 sm:px-4 sm:py-2 rounded text-sm sm:text-base`}
      >
       Website Settings
      </button>
      {currentUser?.role === "superAdmin" && (
       <button
        onClick={() => setActiveTab("manageAdmins")}
        style={{
         backgroundColor:
          activeTab === "manageAdmins"
           ? colors.dark.primaryBtn
           : colors.dark.grayColor,
        }}
        className={`${
         activeTab !== "manageAdmins" && "opacity-80"
        } hover:opacity-100 px-3 text-white py-1.5 sm:px-4 sm:py-2 rounded text-sm sm:text-base`}
       >
        Manage Admins
       </button>
      )}
      <button
       onClick={() => setActiveTab("msgs")}
       style={{
        backgroundColor:
         activeTab === "msgs" ? colors.dark.primaryBtn : colors.dark.grayColor,
       }}
       className={`${
        activeTab !== "msgs" && "opacity-80"
       } hover:opacity-100 px-3 text-white py-1.5 sm:px-4 sm:py-2 rounded text-sm sm:text-base`}
      >
       Messages
      </button>
     </div>
    </div>

    <div
     style={{
      backgroundColor: isDark
       ? colors.dark.secondaryBackground
       : colors.light.secondaryBackground,
     }}
     className="rounded-lg shadow-md p-4 sm:p-6"
    >
     {activeTab === "stats" && <DashboardStats stats={stats} />}
     {activeTab === "users" && (
      <UsersList
       currentUserRole={currentUser?.role}
       canAdminDeleteUser={websiteData.canAdminRemoveUsers}
      />
     )}
     {activeTab === "blogs" && <BlogsList />}
     {activeTab === "settings" && (
      <WebsiteSettings
       websiteData={websiteData}
       setWebsiteData={setWebsiteData}
      />
     )}
     {currentUser?.role === "superAdmin" && activeTab === "manageAdmins" && (
      <ManageAdmins />
     )}
     {activeTab === "msgs" && <AdminMsgs />}
    </div>
   </div>
   <BackToHome />
  </>
 );
};

export default Dashboard;
