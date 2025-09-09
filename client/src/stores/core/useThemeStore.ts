import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "chattyweb_light" | "chattyweb_dark";

interface ThemeState {
  theme: Theme;
  isLoading: boolean;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setLoading: (v: boolean) => void;
}

const getSystemTheme = (): Theme => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "chattyweb_dark"
      : "chattyweb_light";
  }
  return "chattyweb_light";
};

const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: getSystemTheme(),
      isLoading: true,
      setTheme: (t) => {
        set({ theme: t });
        document.documentElement.setAttribute("data-theme", t);
      },
      toggleTheme: () => {
        const current = get().theme;
        const next =
          current === "chattyweb_light" ? "chattyweb_dark" : "chattyweb_light";
        set({ theme: next });
        document.documentElement.setAttribute("data-theme", next);
      },
      setLoading: (v) => set({ isLoading: v }),
    }),
    {
      name: "chattyweb-theme",
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        // إذا مافي theme بال storage → خزّن theme النظام
        const storedTheme = state?.theme;
        if (!storedTheme) {
          const systemTheme = getSystemTheme();
          state?.setTheme(systemTheme); // هاد بيكتب كمان بال storage
        } else {
          document.documentElement.setAttribute("data-theme", storedTheme);
        }
        state?.setLoading(false); // خلص, ما عاد في loading
      },
    },
  ),
);

export default useThemeStore;
