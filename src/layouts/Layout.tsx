import { lazy, Suspense } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
const MemoFooter = lazy(() => import("@/components/layout/Footer"));
import Header from "@/components/layout/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

type Props = {
  children: React.ReactNode;
  hideFooter?: boolean;
  hideSideBar?: boolean;
};

const Layout = ({ children, hideFooter, hideSideBar }: Props) => {
  const isMobile = useIsMobile();
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-screen ">
        {/* Fixed Sidebar */}
        {!isMobile && !hideSideBar && (
          <div className="fixed top-0 left-0 h-screen w-16  z-40">
            <AppSidebar />
          </div>
        )}

        {/* Main layout (with margin-left to avoid sidebar overlap) */}
        <div
          className={`flex flex-col flex-1 w-full ${!isMobile ? "ml-16" : ""}`}
        >
          {/* Fixed Header */}
          <div
            className={`fixed top-0 left-0 ${!isMobile && !hideSideBar ? "left-16" : ""} right-0 h-16 z-30 bg-background overflow-visible`}
          >
            <Header />
          </div>

          {/* Scrollable main content */}
          <main
            className={`mt-16 flex-1 overflow-y-auto p-3 ${isMobile ? "mb-15" : ""}`}
          >
            {children}
          </main>

          {/* Footer (if not hidden) */}
          {!hideFooter && isMobile && (
            <Suspense fallback={<p>loading</p>}>
              <MemoFooter key="footer" />
            </Suspense>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export { Layout };
