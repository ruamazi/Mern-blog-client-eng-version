import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/blog/Navbar";
import Login from "./pages/blog/Login";
import Register, { apiUrl } from "./pages/blog/Register";
import SingleBlog from "./pages/blog/SingleBlog";
import Publish from "./pages/blog/Publish";
import Profile from "./pages/blog/Profile";
import Loader from "./components/blog/Loader";
import { useAuth } from "./context/AuthContext";
import UpdateBlog from "./components/blog/UpdateBlog";
import User from "./pages/blog/User";
import BlogsByTag from "./pages/blog/BlogsByTag";
import PageNotFound from "./components/blog/PageNotFound";
import Dashboard from "./pages/admin/Dashboard";
import ConfirmEmail from "./pages/ConfirmEmail";
import { getCurrentUser, getWebData } from "./functions/api";
import { useTheme } from "./context/ThemeContext";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import ContactAdmins from "./pages/ContactAdmins";
import M3u from "./pages/M3u";
import SearchResults from "./pages/SearchResults";

function App() {
 const { currentUser, setCurrentUser } = useAuth();
 const [loadingUser, setLoadingUser] = useState(false);
 const [webSettings, setWebSettings] = useState({
  websiteName: "",
  websiteTitle: "",
  favicon: "",
  websiteLogo: "",
  canPublish: true,
  showLogo: false,
  showName: true,
 });
 const [loadingWebSettings, setLoadingWebSettings] = useState(false);
 const { colors, darkMode, getColors } = useTheme();

 const getWebSettingsData = async () => {
  setLoadingWebSettings(true);
  const resp = await getWebData();
  setWebSettings(resp);
  setLoadingWebSettings(false);
 };

 const fetchUser = async () => {
  setLoadingUser(true);
  try {
   const user = await getCurrentUser();
   setCurrentUser(user);
  } catch (error) {
   console.error("Field to fetch user");
  } finally {
   setLoadingUser(false);
  }
 };

 useEffect(() => {
  getWebSettingsData();
  getColors();
 }, []);

 useEffect(() => {
  if (webSettings.favicon) {
   let link = document.querySelector("link[rel*='icon']");
   if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
   }
   link.href = webSettings.favicon; // Set the favicon dynamically
  }
 }, [webSettings]);

 useEffect(() => {
  fetchUser();
 }, [setCurrentUser]);

 if (loadingUser || loadingWebSettings) return <Loader />;

 return (
  <div
   style={{
    backgroundColor: darkMode
     ? colors.dark.primaryBackground
     : colors.light.primaryBackground,
   }}
   className={`min-h-screen transition-colors duration-200`}
  >
   <Navbar />
   <main className="container mx-auto px-4 py-8">
    <Routes>
     <Route path="/" element={<Home webSettings={webSettings} />} />
     <Route path="/search" element={<SearchResults />} />
     <Route
      path="/register"
      element={currentUser ? <Navigate to="/" /> : <Register />}
     />
     <Route
      path="/login"
      element={currentUser ? <Navigate to="/" /> : <Login />}
     />
     <Route
      path="/profile"
      element={
       !currentUser ? (
        <Navigate to="/" />
       ) : (
        <Profile setCurrentUser={setCurrentUser} />
       )
      }
     />
     <Route path="/blog/:id" element={<SingleBlog />} />
     <Route path="/publish" element={<Publish />} />
     <Route path="/update-blog/:id" element={<UpdateBlog />} />
     <Route
      path="/user/:username"
      element={<User canAdminDeleteUser={webSettings.canAdminRemoveUsers} />}
     />
     <Route path="/blogs/:tag" element={<BlogsByTag />} />

     <Route
      path="/confirm-email"
      element={currentUser ? <Navigate to="/" /> : <ConfirmEmail />}
     />
     <Route
      path="/forget-password"
      element={currentUser ? <Navigate to="/" /> : <ForgetPassword />}
     />
     <Route
      path="/reset-password"
      element={currentUser ? <Navigate to="/" /> : <ResetPassword />}
     />
     <Route
      path="/admin"
      element={
       currentUser?.role === "user" ? <Navigate to="/" /> : <Dashboard />
      }
     />
     <Route path="/contact" element={<ContactAdmins />} />
     <Route path="*" element={<PageNotFound />} />
     <Route path="/m3u" element={<M3u />} />
    </Routes>
   </main>
  </div>
 );
}

export default App;
