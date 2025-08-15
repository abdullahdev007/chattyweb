import { FC, FormEvent, useState, ChangeEvent } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "@/zustand/useConversation";
import useGetConversations from "@/hooks/conversations/useFetchConversations";
import toast from "react-hot-toast";
import { IConversation } from "@shared/types/models/conversation";

const SearchInput: FC = () => {
  const [search, setSearch] = useState<string>("");
  const { setSelectedConversation } = useConversation();
  const { conversations } = useGetConversations();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      toast.error("Search term must be at least 3 characters long");
    }

    const conversation = conversations.find((c: IConversation) => {
      const participant = c.participants.find((p) =>
        p.userId.fullName.toLowerCase().includes(search.toLowerCase()),
      );
      return !!participant;
    });

    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
    } else toast.error(`No user found with name ${search}`);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} action="" className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search in friends.."
        className="input input-bordered rounded-full"
        value={search}
        onChange={handleSearchChange}
      />
      <button className="btn btn-circle bg-sky-500 text-white">
        <IoSearchSharp className="w-6 h-6 outline-none" />
      </button>
    </form>
  );
};

export default SearchInput;
