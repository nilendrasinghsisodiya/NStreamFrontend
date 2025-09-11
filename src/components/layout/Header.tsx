// import { ToggleTheme } from "./ToogleTheme";
// import { SearchBarDesktop } from "./SearchBar";
// import { memo } from "react";
// import { Link } from "react-router";
// import { UserProfileTab } from "../UserProfile";
// import { useSelector } from "react-redux";
// import { selectUser } from "@/contexts/auth/authSlice";
// import { Video } from "lucide-react";

// const Header = () => {
//   const user = useSelector(selectUser);
//   return (
//     <div className="fixed flex flex-col w-full justify-center left-12 top-0 h-15 py-2">
//       <div className="flex items-center">
//         <span className="text-xl lg:text-2xl tracking-tight font-extrabold">NStream</span>
//         <div className="flex">
//           <span className="flex">
//             <SearchBarDesktop />
//           </span>
//           <span className="flex">
//             <span className="flex items-center">
//               <UserProfileTab />
//             </span>
//             <span className="flex items-center">
//               <Link to={"/upload-video"}>
//                 <Video />
//               </Link>
//             </span>
//             <span className="flex items-center">
//               <ToggleTheme />
//             </span>
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// const MemoHeader = memo(Header);
// export default MemoHeader;
// export { Header };

import { ToggleTheme } from "./ToogleTheme";
import { SearchBarDesktop, SearchBarMobile } from "./SearchBar";
import { memo } from "react";
import { Link } from "react-router";
import { UserProfileTab } from "../UserProfile";
import { Video } from "lucide-react";
import { Separator } from "../ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "../ui/button";

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="w-full h-18 relative flex flex-col z-50 py-2 ">
      <div className="w-full h-full flex items-center justify-evenly px-2 sm:px-4 gap-2 sm:gap-3 border-b bg-background overflow-visible z-50 p-1 sm:p-3">
        <div className="text-xl lg:text-2xl font-extrabold tracking-tight  ">
          <Link to="/">NStream</Link>
        </div>

        <div className="flex items-center gap-3  min-w-[280px] max-w-[650px] h-full  ">
          {!isMobile && <SearchBarDesktop />}
          {isMobile && <SearchBarMobile />}
          <UserProfileTab />

          <Link
            to="/upload-video"
            className="text-primary hover:text-muted-foreground"
          >
            <Button variant={"ghost"} className="bg-transparent h-fit w-fit"><Video className="w-5 h-5" />
          </Button></Link>

          <ToggleTheme />
        </div>
      </div>
      <Separator className="w-full align-bottom" />
    </header>
  );
};

const MemoHeader = memo(Header);
export default MemoHeader;
export { Header };
