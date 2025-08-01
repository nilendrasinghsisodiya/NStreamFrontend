import { Home,  ListVideo } from "lucide-react";
import {
    Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "../ui/sidebar";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Playlists",
    url: "/user-playlists",
    icon: ListVideo,
  },
];


/**
 * A sidebar compenent that creates a sidebar to the left for md break point
 * @returns A React jsx component that represent Navbar to the left side in UI.
 */
const AppSidebar = () => {
  return (
    <Sidebar className="max-w-100 col-span-1 gap-12 justify-around min-h-screen" collapsible="icon" variant="sidebar">
     
      <SidebarContent className="min-h-screen"  >
        <SidebarGroup >
          <SidebarGroupContent className="min-h-screen">
          <SidebarTrigger className="px-2 mb-12 text-bold"  />
            <SidebarMenu className="gap-12">
              {items.map((item) => (
                <SidebarMenuItem key={item.title} tabIndex={0}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="">
                      <item.icon className="h-full w-full min-w-5 min-h-5 " strokeWidth="3"/>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export { AppSidebar };
