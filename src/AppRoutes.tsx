import { Layout } from "./layouts/Layout";
import { Routes, Route, useNavigate } from "react-router";
import { VideoPage } from "./pages/Video/VideoPage";
import { AuthPage } from "./pages/Auth/AuthPage";
import { HomePage } from "./pages/Main/HomePage";
import { ProfileForm} from "./forms/UserProfile";
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
const AppRoutes = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigateGlobal(navigate);
  }, [navigate]);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route path="upload-video" element={
        <Layout>
          <VideoUploadForm />
        </Layout>
      }/>
      <Route
        path="user-playlists"
        element={
          <Layout>
            <MainPlaylistPage />
          </Layout>
        }
      />
      <Route path="dashboard" element={ <Layout><Dashboard/></Layout>} />
      <Route
        path="watch"
        element={
          <Layout>
            <VideoPage />
          </Layout>
        }
      />
      <Route path="search" element={<Layout><SearchPage/></Layout>}/>
      <Route
        path="auth"
        element={
          <Layout hideFooter>
            <AuthPage />
          </Layout>
        }
      />
        <Route
          path="user-reg-profile"
          element={
            <Layout hideFooter>
              <ProfileForm/>
            </Layout>
          }
        />
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


      <Route
        path="playlist"
        element={
          <Layout>
            <PlaylistPage />
          </Layout>
        }
      />
    </Routes>
  );
};

export { AppRoutes };
