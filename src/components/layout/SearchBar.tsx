import { Search } from "lucide-react";
import { Button } from "../ui/button";

const SearchBar = () => {
  return (
    <div className="flex gap-0 w-full p-0 m-0 justify-center items-center flex-1 h-full  ">
      <span>
        <input
        tabIndex={0}
          type="text"
          name="search"
          autoCorrect="true"
          placeholder="search here...."
          draggable={false}
          className=" hidden md:block  lg:py-4 lg:px-6 lg:text-2xl md:min-w-100 lg:min-w-140 flex-2/3 py-2  bg-background border-2 border-accent px-4 text-[1.4rem] rounded-lg border-r-0 rounded-r-none  focus-visible:ring-transparent text-accent-foreground selection:text-blue-900 selection:bg-blue-400 h-full md:w-full"
        />
      </span>
      <span>
        <Button
          variant="ghost"
          className="rounded-md py-3 lg:py-[1.3rem] md:bg-accent md:border-accent rounded-l-none md:border-[0.1rem] bg-transparent  h-full "
        >
          <Search  className="text-accent-foreground p-0 m-0 icons-s md:icons-m xl:icons-lg" />
        </Button>
      </span>
    </div>
  );
};

export { SearchBar };
