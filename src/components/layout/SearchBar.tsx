import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Input } from "../ui/input";

const SearchBar = () => {

  const [active,setActive] = useState<boolean>(false);
  return (
    <div className="flex gap-0 w-full p-0 m-0 justify-center items-center flex-1 lg:min-h-[80px] max-h-[100px]  ">
      <span className="max-h-full">
        <Input
        tabIndex={0}
        id="searchText"

          type="text"
          name="search"
          autoCorrect="true"
          placeholder="search here...."
          draggable={false}
          onFocusCapture={()=>{setActive(true)}}
          onBlurCapture={()=>{setActive(false)}}
          className=" hidden md:block   lg:text-2xl md:min-w-100 lg:min-w-140 flex-2/3 py-3 px-5 bg-background border-[.15rem] border-accent text-[1.4rem] rounded-lg border-r-0 rounded-r-none  focus-visible:ring-transparent text-accent-foreground selection:text-blue-900 selection:bg-blue-400 h-full md:w-full"
        />
      </span>
      <span className="max-w-13 max-h-13 ">
        <Button tabIndex={0}
          variant="ghost"
          className={`h-12 w-12 md:bg-accent border-2 border-background/12 boder-l-0 rounded-l-none   ${active && 'border-1 border-accent-foreground'}`}
        >
          <Search  className="text-accent-foreground w-full h-full" />
        </Button>
      </span>
    </div>
  );
};

export { SearchBar };
