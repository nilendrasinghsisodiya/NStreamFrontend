import { ToggleTheme } from "./ToogleTheme";
import { SearchBar } from "./SearchBar";
import {memo } from "react"
import { Link } from "react-router";
import { UserProfileTab } from "../UserProfile";
import { useSelector } from "react-redux";
import { selectUser } from "@/contexts/auth/authSlice";
import { Video } from "lucide-react";

const Header = () => {
  const user = useSelector(selectUser);
  return (
    <div
      className=" relative flex  w-full min-h-12 z-50 justify-between items-center border-b-1 shadow-2xs dark:shadow-none  border-b-primary md:self-start bg-background gap-4  top-0 
    md:py-6 lg:py-7 px-3 max-h-22  "
    >
       < Link   tabIndex={0} to="/" className="text-foreground text-xl tracking-tight lg:text-2xl font-bold mx-3">
        NStream
      </Link>
      <div className="flex gap-4 justify-between xl:justify-around items-center md:w-full h-full md:flex-1 ">
       <SearchBar />
         <div className="flex gap-6 justify-end items-center w-fit h-full xl:mr-19 ">
        <span className=" flex min-w-[18px] min-h-[18px] max-w-[35px] max-h-[35px]">
          
         <UserProfileTab />
        </span>
        <span className="hidden md:block min-w-[20px] min-h-[20px] max-h-[40px] max-w-[40px]">
          <Link to={user?"/video/upload":"/auth"}><Video/></Link>
        </span>

        <span className="flex box-border md:justify-self-end min-w-[20px] min-h-[20px] max-h-[40px] max-w-[40px]">
          <ToggleTheme />
        </span>
        </div>
      </div>
    </div>
  );
};

const MemoHeader = memo(Header);
export default MemoHeader;
export { Header };
