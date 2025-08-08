import { Home, ListVideo, HistoryIcon, ThumbsUp, AlarmClockPlus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Link } from "react-router";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Playlists", url: "/user-playlists", icon: ListVideo },
  { title: "History", url: "/watch-history", icon: HistoryIcon },
  {
    title: "Liked Videos",
    url: "/liked-video",
    icon: () => <ThumbsUp className="fill-foreground" />,
  },
  {title:"Watch Later",url:"/watch-later",icon:AlarmClockPlus}
];

const AppSidebar = () => {
  return (
    <Sidebar
      className="h-full w-full bg-background border-r"
      collapsible="none"
      variant="sidebar"
    >
      <SidebarContent className="h-full py-4 px-2">
        <SidebarGroup>
          <SidebarGroupContent className="space-y-6">
            <SidebarMenu className="space-y-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.title} tabIndex={0}>
                  <Link
                    to={item.url}
                    className="flex flex-col items-center gap-2 text-sm font-medium"
                  >
                    <item.icon className="w-5 h-5" strokeWidth="2" />
                    <span className="text-xs">{item.title}</span>
                  </Link>
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
