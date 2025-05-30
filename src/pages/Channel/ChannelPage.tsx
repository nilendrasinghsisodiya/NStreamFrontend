import { ChannelPanel } from "@/components/channel/channelPanel";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
} from "@radix-ui/react-navigation-menu";
import { useState } from "react";
import { Link, Outlet, useSearchParams } from "react-router";

const ChannelPage = () => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username") as string;
  const tabs: { name: string; to: string, index:string }[] = [
    {name:"Home",to:`home?username=${username}`,index:"first"},
    { name: "Videos", to: `videos?username=${username}`,index:"second" },
    { name: "Playlists", to: `playlists?username=${username}`,index:"third" },
  ];
  const [active,setActive]= useState<string>("");
  return (
    <div className="flex flex-col justify-center items-center h-full w-full p-3 gap-y-2">
      <ChannelPanel
        username={username}
        className="gap-6 outline-2 outline-red-500 max-h-200 "
      />
      <NavigationMenu className="flex w-full gap-x-3 items-center justify-center list-none">
        {tabs.map((ele) => (
          <NavigationMenuItem key={ele.index}>
            <Button
              variant={active===ele.index?"default":"secondary"}
              className="active:bg-accent/40 active:border-accent active:text-foreground"
              onClick={()=>{
                setActive(ele.index) 
              }
            
              }
            >
              <Link to={ele.to} key={ele.index}>{ele.name}</Link>
            </Button>
          </NavigationMenuItem>
        ))}
      </NavigationMenu>
    <div className="w-ful h-full flex min-w-full"><Outlet/></div>
    </div>
  );
};

export { ChannelPage };
