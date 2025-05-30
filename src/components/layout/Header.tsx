import { ToggleTheme } from "./ToogleTheme";
import { SearchBar } from "./SearchBar";
import {memo } from "react"
import { Link } from "react-router";
import { UserProfileTab } from "../UserProfile";

const Header = () => {
  return (
    <div
      className=" relative flex  w-full z-50 justify-between items-center border-b-1 shadow-2xs dark:shadow-none  border-b-primary md:self-start bg-background gap-4  top-0 
    md:py-6 lg:py-7 px-3 max-h-22 "
    >
      <Link to="/" className="text-foreground text-[2rem] tracking-wide lg:text-[3rem] font-bold mx-3">
        NStream
      </Link>
      <div className="flex gap-4 justify-between xl:justify-around items-center md:w-full h-full md:flex-1 ">
       <SearchBar />
         <div className="flex gap-6 justify-end items-center w-fit h-full ">
        <span className="xl:mr-6 max-h-12 max-w-12 lg:max-h-15 lg:max-w-15 outline-2 outline-yellow-300">
          
         <UserProfileTab />
        </span>

        <span className="flex box-border md:justify-self-end ">
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
