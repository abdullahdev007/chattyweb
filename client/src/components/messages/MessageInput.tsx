import useSendMessage from "../../hooks/useSendMessage";
import { useState } from "react";
import InputEmoji from "react-input-emoji";
import React from "react";

const MessageInput: React.FC = () => {
  const { loading, sendMessage } = useSendMessage();
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (text: string) => {
    if (!text) return;
    await sendMessage(text);
    setMessage("");
  };

  return (
    <div className="px-4 my-3">
      <div className="w-full relative">
        <InputEmoji
          value={message}
          onChange={setMessage}
          cleanOnEnter
          onEnter={handleSubmit}
          disableRecent={loading}
          placeholder="Send a message"
          theme="dark"
          color="white"
          background="rgb(55 65 81 / 1)"
          shouldReturn={false}
          shouldConvertEmojiToImage={false}
        />
      </div>
    </div>
  );
};

export default MessageInput;
