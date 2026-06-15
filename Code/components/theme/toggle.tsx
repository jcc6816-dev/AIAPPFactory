"use client";

import { BsMoonStars, BsSun } from "react-icons/bs";

import { CacheKey } from "@/services/constant";
import { cacheSet } from "@/lib/cache";
import { useAppContext } from "@/contexts/app";

export default function () {
  const { theme, setTheme } = useAppContext();

  const handleThemeChange = function (_theme: string) {
    if (_theme === theme) {
      return;
    }

    cacheSet(CacheKey.Theme, _theme, -1);
    setTheme(_theme);
  };

  return (
    <div className="flex items-center gap-x-2 px-2">
      <button
        type="button"
        className="flex items-center justify-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-0 bg-transparent cursor-pointer text-muted-foreground focus:outline-none"
        onClick={() => handleThemeChange(theme === "dark" ? "light" : "dark")}
        aria-label={theme === "dark" ? "切换至浅色模式" : "切换至深色模式"}
        title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      >
        {theme === "dark" ? (
          <BsSun className="text-lg" />
        ) : (
          <BsMoonStars className="text-lg" />
        )}
      </button>
    </div>
  );
}
