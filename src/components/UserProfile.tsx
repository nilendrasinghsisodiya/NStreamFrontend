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
import { selectUser, reset as userReset } from "@/contexts/auth/authSlice";

import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useLogoutUser } from "@/api/UserApi";
import { presister } from "@/ContextStore";

const UserProfileTab = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const { logout } = useLogoutUser();
  const navigate = useNavigate();

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
        <DropdownMenuTrigger className="flex items-center justify-center p-2 outline-2" >
          <Button  variant={"ghost"} asChild tabIndex={0} >
            <SafeAvatar
              avatar={user?.avatar}
              username={user?.username}
              to={"#"}
              failLink="/auth" 
              className=""
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className=" z-50 border-2 border-accent-foreground/40 bg-accent p-2 rounded-xl w-full h-full"
          alignOffset={23}
          align="start"
          sideOffset={20}
        >
          <DropdownMenuLabel>My Profile</DropdownMenuLabel>
          <DropdownMenuSeparator className="text-accent-foreground/45" />
          {user.accessToken ? (
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link to={`/channel/home?username=${user?.username}`}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={`setting/?username=${user?.username}`}>
                  Setting
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem></DropdownMenuItem>
              <DropdownMenuItem>
                <Button variant="ghost" onClick={handleLogout}>
                  Logout <LogOut className="icons-sm" />
                </Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          ) : (
            <DropdownMenuItem>
              <Link to={"/auth"}>LogIn</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export { UserProfileTab };
