import { FC, ChangeEvent, useState } from "react";
import { IoClose } from "react-icons/io5";
import useSearchConversation from "@/zustand/useSearchConversation";

export const SearchConversation: FC = () => {
  const { setSearchConversation } = useSearchConversation();
  const [search, setSearch] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearch(e.target.value);
    setSearchConversation(e.target.value);
  };

  return (
    <label className="input input-bordered flex items-center gap-2 justify-center max-xs:w-full">
      <input
        type="text"
        placeholder="Search conversation.."
        className="overflow-x-auto"
        value={search}
        onChange={handleChange}
      />
      {search.length > 0 && (
        <IoClose
          onClick={() => {
            setSearch("");
            setSearchConversation("");
          }}
          className="cursor-pointer"
        />
      )}
    </label>
  );
};
