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
  const { logout,isError } = useLogoutUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    console.log(user);
    dispatch(userReset());
    if (!isError)
    presister.purge();
    navigate("/");
  };
  return (
    <>
      <DropdownMenu modal>
        <DropdownMenuTrigger>
          <Button ref={null} variant={"ghost"} asChild>
            <SafeAvatar
              avatar={user?.avatar}
              username={user?.username}
              to={"#"}
              failLink="/auth"
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="outline-2 outline-green-200 z-50 border-2xl border-white"
          alignOffset={23}
          align="start"
          sideOffset={20}
        >
          <DropdownMenuLabel>My Profile</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link to={user?`channel?username=${user?.username}`:'/auth'}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={`channel?username=${user?.username}/setting`}>
                Setting
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem></DropdownMenuItem>
          </DropdownMenuGroup>
          <Button variant="ghost" onClick={handleLogout}>
            Logout <LogOut className="icons-sm" />
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export { UserProfileTab };
