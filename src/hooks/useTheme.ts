import { useDispatch } from "react-redux";
import {
  setTheme,
  ThemeType,
  selectTheme,
} from "./../contexts/theme/themeSlices";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const storageKey = "nstreams-theme-key";

  // Load the saved theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as ThemeType | null;
    console.log("savedTheme", savedTheme);
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    const applyTheme = (currentTheme: ThemeType) => {
      console.log("currentTheme", currentTheme);
      if (currentTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(currentTheme);
      }
      localStorage.setItem(storageKey, currentTheme);
    };

    applyTheme(theme);

    // **Handle system preference changes**
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      console.log("mediaquery", mediaQuery);
      const handleSystemThemeChange = () => {
        applyTheme("system"); // Re-apply the system theme logic
      };

      mediaQuery.addEventListener("change", handleSystemThemeChange);

      return () => {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      };
    }
  }, [theme]);

  const changeTheme = (newTheme: ThemeType) => {
    dispatch(setTheme(newTheme));
  };

  return { theme, changeTheme };
};

export { useTheme };
