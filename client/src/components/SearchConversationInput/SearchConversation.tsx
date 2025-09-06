import { FC, ChangeEvent, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { useSearchConversation } from "@/stores";

export const SearchConversation: FC = () => {
  const { setSearchConversation } = useSearchConversation();
  const [search, setSearch] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearch(e.target.value);
    setSearchConversation(e.target.value);
  };

  const handleClear = () => {
    setSearch("");
    setSearchConversation("");
  };

  return (
    <div className="form-control w-full">
      <div className="relative group">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <FaSearch
            className={`text-lg transition-all duration-300 ${
              isFocused
                ? "text-secondary scale-110"
                : "text-base-content/50 group-hover:text-base-content/70"
            }`}
          />
        </div>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Search conversations..."
          className="input input-bordered w-full pl-12 pr-12 py-3 text-sm transition-all duration-300 focus:input-secondary focus:ring-2 focus:ring-secondary/20 hover:border-secondary/50"
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={search}
        />

        {/* Clear Button */}
        {search.length > 0 && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 btn btn-circle btn-ghost btn-xs hover:btn-error transition-all duration-300 hover:scale-110"
            onClick={handleClear}
            title="Clear search"
          >
            <IoClose className="text-sm" />
          </button>
        )}

        {/* Focus Ring Effect */}
        {isFocused && (
          <div className="absolute inset-0 rounded-lg ring-2 ring-secondary/20 ring-offset-2 ring-offset-base-100 pointer-events-none animate-pulse"></div>
        )}

        {/* Cool Gradient Border Effect */}
        <div
          className={`absolute inset-0 rounded-lg bg-gradient-to-r from-secondary/10 via-accent/10 to-primary/10 opacity-0 transition-opacity duration-300 pointer-events-none ${
            isFocused ? "opacity-100" : ""
          }`}
        ></div>
      </div>
    </div>
  );
};
