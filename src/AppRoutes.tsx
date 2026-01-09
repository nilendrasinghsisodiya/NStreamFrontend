import { Layout } from "./layouts/Layout";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { VideoPage } from "./pages/Video/VideoPage";
import { AuthPage } from "./pages/Auth/AuthPage";
import { HomePage } from "./pages/Main/HomePage";
import { ProfileForm } from "./forms/UserProfile";
import { ChannelPage } from "./pages/Channel/ChannelPage";
import { PlaylistPage } from "./pages/Playlist/PlaylistPage";
import { PlaylistPage as MainPlaylistPage } from "./pages/Main/PlaylistPage";
import { ChannelVideoPage } from "./pages/Channel/ChannelVideoPage";
import { ChannelHomePage } from "./pages/Channel/ChannelHomePage";
import { useEffect } from "react";
import { setNavigateGlobal } from "./utils";
import { ChannelPlaylistPage } from "./pages/Channel/ChannelPlaylistPage";
import { VideoUploadForm } from "./pages/Main/VideoUploadPage";
import { Dashboard } from "./pages/Main/DashboardPage";
import { SearchPage } from "./pages/Main/SearchPage";
import { WatchHistoryPage } from "./pages/Main/WatchHistory";
import { ErrorScreen } from "./components/ErrorComponent";
import { LikedVideoPage } from "./pages/Main/LikedVideoPage";
import { ProfileEditPage } from "./pages/Settings/ProfileEdit";
import { VideoControlPage } from "./pages/Settings/VideoControll";
import { SubscribptionPage } from "./pages/Main/Subscribtion";
const AppRoutes = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigateGlobal(navigate);
  }, [navigate]);
  return (
    <Routes>
      {/** main routes */}
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route
          path="watch-history"
          element={
            <Layout>
              <WatchHistoryPage />
            </Layout>
          }
        />
        <Route
          path="liked-videos"
          element={
            <Layout>
              <LikedVideoPage />
            </Layout>
          }
        />
        <Route
          path="user-playlists"
          element={
            <Layout>
              <MainPlaylistPage />
            </Layout>
          }
        />
        <Route
          path="playlist"
          element={
            <Layout>
              <PlaylistPage />
            </Layout>
          }
        />
        <Route
          path="dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/settings/video"
          element={
            <Layout>
              <VideoControlPage />
            </Layout>
          }
        />
        {/*Video Routes */}
        <Route
          path="upload-video"
          element={
            <Layout>
              <VideoUploadForm />
            </Layout>
          }
        />
        <Route
          path="user-reg-profile"
          element={
            <Layout hideFooter>
              <ProfileForm />
            </Layout>
          }
        />
        <Route
          path="subscriptions"
          element={
            <Layout>
              <SubscribptionPage />
            </Layout>
          }
        />
        {/* Controll routes*/}
        <Route
          path="/settings/channel"
          element={
            <Layout>
              <ProfileEditPage />
            </Layout>
          }
        />
      </Route>
      <Route
        path="watch"
        element={
          <Layout>
            <VideoPage />
          </Layout>
        }
      />
      <Route
        path="search"
        element={
          <Layout>
            <SearchPage />
          </Layout>
        }
      />
      <Route
        path="auth"
        element={
          <Layout hideFooter>
            <AuthPage />
          </Layout>
        }
      />

      {/* Channel routes */}
      <Route
        path="channel"
        element={
          <Layout>
            <ChannelPage />
          </Layout>
        }
      >
        <Route path="home" element={<ChannelHomePage />} />
        <Route path="playlists" element={<ChannelPlaylistPage />} />
        <Route path="videos" element={<ChannelVideoPage />} />
      </Route>

      {/* golbal routes */}
      <Route
        path="*"
        element={
          <div className="h-screen w-screen">
            <ErrorScreen
              mainMessage="ERROR:404 NOT FOUND"
              secondaryMessage="this page does not exist"
              isError
            />
          </div>
        }
      />
    </Routes>
  );
};

export { AppRoutes };
