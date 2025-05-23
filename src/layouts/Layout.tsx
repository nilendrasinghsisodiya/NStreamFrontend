import { lazy, Suspense } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
const MemoFooter = lazy(() => import("@/components/layout/Footer"));
import Header from "@/components/layout/Header";
import { SidebarProvider } from "@/components/ui/sidebar";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-row min-w-screen min-h-screen">
      <SidebarProvider defaultOpen={false} className="">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen items-center">
          <Header />
          <main className="flex h-full flex-col w-full hover:data-[videoCard]:bg-white overflow-y-scroll items-center flex-1 ">
            {children}
          </main>
          <Suspense fallback={<p>loading</p>}>
            <MemoFooter key="footer" />
          </Suspense>
        </div>
      </SidebarProvider>
    </div>
  );
};

export { Layout };
