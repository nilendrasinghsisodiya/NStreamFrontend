import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { SafeAvatar } from "./avatar/Avatars";
import { LogOut } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser, useIsAuthenticated, reset as userReset } from "@/contexts/auth/authSlice";

import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useLogoutUser } from "@/api/UserApi";
import { presister } from "@/ContextStore";
import { Separator } from "./ui/separator";

const UserProfileTab = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const { logout } = useLogoutUser();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  const handleLogout = async () => {
    try {
      await logout();
      console.log(user);
      dispatch(userReset());

      presister.purge();
      navigate("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.warn(e.message);
    }
  };
  return (
    <>
      <DropdownMenu modal >
        <DropdownMenuTrigger className="flex items-center justify-center p-2 " >
          <Button  variant={"ghost"} asChild tabIndex={0} >
            <SafeAvatar
              avatar={user?.avatar}
              username={user?.username}
              to={"#"}
              failLink="/auth" 
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className=" z-50  bg-accent p-2 rounded-sm h-fit w-fit"
          align="start"
          sideOffset={10}
        >
          <DropdownMenuLabel className="text-foreground font-semibold tracking-tight ">Profile</DropdownMenuLabel>
          <Separator className="bg-foreground/50 my-0.5"/>
          <DropdownMenuSeparator className="bg-foreground" />
          {isAuthenticated? (
            <DropdownMenuGroup>
              
                <DropdownMenuItem >
                  <Link to="/dashboard" className="text-sm font-semibold tracking-tight">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to={`/channel/home?username=${user.username}`} className="text-sm font-semibold tracking-tight">Home</Link>
                </DropdownMenuItem>
           
             
              <DropdownMenuItem>
                <Button variant="ghost" className="text-sm tracking-tight font-semibold"onClick={handleLogout}>
                  Logout <LogOut className="h-full w-full" />
                </Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          ) : (
            <DropdownMenuItem>
              <Link to={"/auth"} className="text-sm font-semibold tracking-tight">Log In</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export { UserProfileTab };
