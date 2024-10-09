import { useEffect, useState } from "react";
import socket from "./socket";

export default function ChatDemo() {
  const profile = JSON.parse(localStorage.getItem("profile"));
  const [value, setValue] = useState("");
  const [conversations, setConversations] = useState([]);
  // const [receiver, setReceiver] = useState("");
  useEffect(() => {
    socket.auth = {
      _id: profile._id,
    };
    socket.connect();
    socket.on("receive private message", (data) => {
      // console.log(data);
      // const { payload } = data;
      const content = data.content;
      setConversations((conversations) => [...conversations, content]);
    });
    return () => {
      socket.disconnect();
    };
  }, [profile._id]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setValue("");
    socket.emit("private message", {
      content: value,
      to: "66f8e1577a3f80640fdfe2c0", //user_id
    });
  };
  return (
    <div>
      <h1>Chat</h1>
      <div>
        {conversations.map((message, index) => (
          <>
            <div key={index}>
              <div>{message}</div>
            </div>
          </>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={value}
          type="text"
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
