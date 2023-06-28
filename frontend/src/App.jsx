import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AboutPage from "./components/about/AboutPage";
import UserFavorite from "./components/dashbord/UserFavorite";
import EditAbo from "./components/dashbord/EditAbo";
import EditProfile from "./components/dashbord/EditProfile";
import UserProfile from "./components/dashbord/UserProfile";
import AdminPanel from "./components/adminPannel/AdminPanel";
import Header from "./components/Header/Header";
import ConnectionPage from "./components/User/ConnectionPage";
import Profile from "./components/User/Profile";
import Advert from "./components/advertising/Advert";
import Footer from "./components/footer/Footer";
import DataTable from "./components/adminPannel/DataTable";
import VideosManagement from "./components/adminPannel/VideosManagement";
import SectionsManagement from "./components/adminPannel/SectionsManagement";
import AdvertsManagement from "./components/advertising/AdvertManagement";
import Homepage2 from "./pages/Homepage2";
import SectionUpdate from "./components/adminPannel/SectionUpdate";
import VideoUpdate from "./components/adminPannel/VideoUpdate";
import SectionAdd from "./components/adminPannel/SectionAdd";
import VideoAdd from "./components/adminPannel/VideoAdd";
import AdminWall from "./utils/AdminWall";
import VideoDescription from "./components/VideoDescription/VideoDescription";
import AdvertAdd from "./components/advertising/AdvertAdd";
import LegalConditions from "./components/Legal/LegalConditions";
import Contact from "./components/about/Contact";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Homepage2 />} />
            <Route path="/connexion" element={<ConnectionPage />} />
            <Route path="/aboutPage" element={<AboutPage />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />}>
              <Route path="/profile/userid" element={<UserProfile />} />
              <Route path="/profile/useredit" element={<EditProfile />} />
              <Route path="/profile/aboedit" element={<EditAbo />} />
              <Route path="/profile/userfavorite" element={<UserFavorite />} />
            </Route>
            <Route
              path="adminPanel"
              element={
                <AdminWall>
                  <AdminPanel />
                </AdminWall>
              }
            >
              <Route
                path="usersTable"
                element={
                  <AdminWall>
                    <DataTable />
                  </AdminWall>
                }
              />
              <Route
                path="videosTable"
                element={
                  <AdminWall>
                    <VideosManagement />
                  </AdminWall>
                }
              />
              <Route
                path="sectionsTable"
                element={
                  <AdminWall>
                    <SectionsManagement />
                  </AdminWall>
                }
              />
              <Route
                path="AdvertsTable"
                element={
                  <AdminWall>
                    <AdvertsManagement />
                  </AdminWall>
                }
              />
            </Route>
            <Route
              path="/sections/:id"
              element={
                <AdminWall>
                  <SectionUpdate />
                </AdminWall>
              }
            />
            <Route
              path="/videos/:id"
              element={
                <AdminWall>
                  <VideoUpdate />
                </AdminWall>
              }
            />
            <Route
              path="/advertManagementWindow"
              element={
                <AdminWall>
                  <AdvertAdd />
                </AdminWall>
              }
            />

            <Route
              path="video_description/:id"
              element={<VideoDescription />}
            />

            <Route
              path="/newSection"
              element={
                <AdminWall>
                  <SectionAdd />
                </AdminWall>
              }
            />
            <Route
              path="/newVideo"
              element={
                <AdminWall>
                  <VideoAdd />
                </AdminWall>
              }
            />
            <Route path="/legal-conditions" element={<LegalConditions />} />
          </Routes>
          <Footer />
        </Router>
        <Advert />
      </AuthProvider>
    </div>
  );
}

export default App;
