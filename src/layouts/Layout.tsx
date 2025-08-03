import { lazy, Suspense } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
const MemoFooter = lazy(() => import("@/components/layout/Footer"));
import Header from "@/components/layout/Header";
import { SidebarProvider } from "@/components/ui/sidebar";

type Props = {
  children: React.ReactNode;
  hideFooter?:boolean;
};

const Layout = ({ children, hideFooter}: Props) => {
  return (
    <div className="flex flex-row min-w-screen min-h-screen">
      <SidebarProvider defaultOpen={false} className="">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen items-center h-full w-full">
         <div className="w-full h-22 z-50"><Header/></div> 
          <main className="max-w-screen  w-full overflow-y-scroll items-center flex-1 p-3 m-auto">
            {children}
          </main>
         {!hideFooter && <Suspense fallback={<p>loading</p>}>
            <MemoFooter key="footer" />
          </Suspense>}
        </div>
      </SidebarProvider>
    </div>
  );
};

export { Layout };
