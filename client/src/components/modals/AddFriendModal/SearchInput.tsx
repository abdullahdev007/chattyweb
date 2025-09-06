import { FC, ChangeEvent, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface SearchInputProps {
  search: string;
  setSearch: (value: string) => void;
}

const SearchInput: FC<SearchInputProps> = ({ search, setSearch }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="form-control w-full">
      <div className="relative group">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <FaSearch
            className={`text-lg transition-all duration-300 ${
              isFocused
                ? "text-primary scale-110"
                : "text-base-content/50 group-hover:text-base-content/70"
            }`}
          />
        </div>

        {/* Input Field */}
        <input
          type="text"
          autoFocus
          placeholder="Search for users by username..."
          className="input input-bordered w-full pl-12 pr-12 py-4 text-base transition-all duration-300 focus:input-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={search}
        />

        {/* Clear Button */}
        {search.length > 0 && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 btn btn-circle btn-ghost btn-sm hover:btn-error transition-all duration-300 hover:scale-110"
            onClick={() => setSearch("")}
            title="Clear search"
          >
            <IoClose className="text-lg" />
          </button>
        )}

        {/* Focus Ring Effect */}
        {isFocused && (
          <div className="absolute inset-0 rounded-lg ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100 pointer-events-none animate-pulse"></div>
        )}

        {/* Cool Gradient Border Effect */}
        <div
          className={`absolute inset-0 rounded-lg bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 opacity-0 transition-opacity duration-300 pointer-events-none ${
            isFocused ? "opacity-100" : ""
          }`}
        ></div>
      </div>

      {/* Search Status */}
      {search.length > 0 && (
        <div className="mt-1 text-xs text-base-content/60 animate-fade-in">
          {search.length < 3 ? (
            <span className="text-warning">
              Type at least 3 characters to search
            </span>
          ) : (
            <span className="text-success">Searching for "{search}"...</span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
