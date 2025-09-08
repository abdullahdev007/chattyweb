import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import useThemeStore from "@/stores/core/useThemeStore";

const ThemeToggle: React.FC = () => {
  const { toggleTheme, theme, isLoading } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      disabled={isLoading}
      className="btn btn-ghost btn-circle btn-sm hover:scale-110 transition-all duration-300 hover:bg-base-200"
      title={`Switch to ${theme === "chattyweb_light" ? "dark" : "light"} theme`}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : theme === "chattyweb_light" ? (
        <FaMoon className="w-4 h-4 text-base-content hover:text-primary transition-colors duration-200" />
      ) : (
        <FaSun className="w-4 h-4 text-base-content hover:text-accent transition-colors duration-200" />
      )}
    </button>
  );
};

export default ThemeToggle;
