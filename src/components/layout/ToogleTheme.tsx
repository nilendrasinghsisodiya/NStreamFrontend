import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useTheme } from "@/hooks/useTheme";

export function ToggleTheme() {
  const { theme, changeTheme } = useTheme();

  return (
    <Button
      variant="ghost"
       tabIndex={0} 
      className=" border-[0.2rem] contain-content icons-s text-xl m-0 border-transparent bg-transparent rounded-lg w-full h-full"
      value={theme}
      onClick={() => {
        changeTheme(theme === "light" ? "dark" : "light");
      }}
    >
      <Sun size={24} className=" p-0.5 m-0  icons-s md:icons-m xl:icons-lg rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary hover:text-muted-foreground" />
      <Moon size={24} className="absolute p-0.5 m-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100  icons-s md:icons-m xl:icons-lg text-primary hover:text-muted-foreground" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
