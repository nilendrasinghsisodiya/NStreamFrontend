import { Layout } from "./layouts/Layout";
import { Routes, Route } from "react-router";
import { VideoPage } from "./pages/Video/VideoPage";
import { AuthPage } from "./pages/Auth/AuthPage";
import { HomePage } from "./pages/Main/HomePage";
import { TestComponent, TestPage } from "./components/TestComponent";
import { UserProfileForm } from "./forms/UserProfile";
import { ChannelPage } from "./pages/Channel/ChannelPage";
const AppRoutes = () => {
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
      <Route
        path="watch"
        element={
          <Layout>
            <VideoPage />
          </Layout>
        }
      />
      <Route
        path="auth"
        element={
          <Layout>
            <AuthPage />
          </Layout>
        }
      />
      <Route path="channel" element={
            <Layout>
              <ChannelPage />
            </Layout>
          }>
        

        <Route
          path="user-profile"
          element={
            <Layout>
              <UserProfileForm isLoading={false} onSave={() => {}} />
            </Layout>
          }
        />
      </Route>

      <Route
        path="test"
        element={
          <TestComponent>
            <div>test</div>
          </TestComponent>
        }
      />
    </Routes>
  );
};

export { AppRoutes };
