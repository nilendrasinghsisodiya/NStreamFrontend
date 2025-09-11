import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SafeAvatar } from "./avatar/Avatars";
import { LogOut } from "lucide-react";
import { useSelector } from "react-redux";
import {
  selectUser,
  useIsAuthenticated,
  reset as userReset,
} from "@/contexts/auth/authSlice";

import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useLogoutUser } from "@/api/UserApi";
import { presister } from "@/ContextStore";
import { useIsMobile } from "@/hooks/use-mobile";

const UserProfileTab = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const { logout } = useLogoutUser();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const isMobile = useIsMobile();
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
      <DropdownMenu >
        <DropdownMenuTrigger className="flex items-center justify-center p-2 w-14 h-14 ">
          <Button variant={"ghost"} asChild tabIndex={0}>
            <SafeAvatar
              avatar={user?.avatar}
              username={user?.username}
              to={"#"}
              failLink="/auth"
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className=" z-50 text-sm font-semibold tracking-tight text-foreground  bg-accent p-2 rounded-sm h-fit w-fit"
          align="start"
          sideOffset={10}
        >
          <DropdownMenuLabel className="text-md">
            Profile
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-foreground/50 my-0.5" />
          {isAuthenticated ? (
            <>
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-right">
                <Link
                  to="/dashboard"
                >
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  to={`/channel/home?username=${user.username}`}
                >
                  Home
                </Link>
              </DropdownMenuItem>
              {isMobile && (
                <>
                  <DropdownMenuItem><Link to="/liked-videos">Liked Videos</Link></DropdownMenuItem>
                  <DropdownMenuItem><Link to={"/watch-history"}>Watch History</Link></DropdownMenuItem>
                  <DropdownMenuItem><Link to="/user-playlists">Playlists</Link></DropdownMenuItem>
                </>
              )}

                </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Setting</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-foreground/50 my-0.5"/>
              <DropdownMenuItem><Link to={"/settings/channel"}>Channel</Link></DropdownMenuItem>
              <DropdownMenuItem><Link to="/settings/video" >Video</Link></DropdownMenuItem>
            </DropdownMenuGroup>
              <DropdownMenuItem>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                >
                  Logout <LogOut className="h-full w-full" />
                </Button>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem>
              <Link
                to={"/auth"}
              >
                Log In
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export { UserProfileTab };
