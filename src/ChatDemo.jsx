import { useEffect, useState } from "react";
import socket from "./socket";
import axios from "axios";

export default function ChatDemo() {
  const profile = JSON.parse(localStorage.getItem("profile"));
  const usernames = [
    {
      name: "user1",
      value: "user64be0ad2e43d2464394feedb",
    },
    {
      name: "user2",
      value: "user64be0cd2b28d088a1e8f963c",
    },
  ];
  const [value, setValue] = useState("");
  const [conversations, setConversations] = useState([]);
  const [receiver, setReceiver] = useState("");
  const getProfile = (username) => {
    axios
      .get(`users/${username}`, {
        baseURL: import.meta.env.VITE_API_URL,
      })
      .then((res) => {
        setReceiver(res.data.result.id);
        alert(`Now you can chat with ${res.data.result.name}`)
      });
  };
  useEffect(() => {
    socket.auth = {
      _id: profile._id,
    };
    socket.connect();
    socket.on("receive private message", (data) => {
      // console.log(data);
      // const { payload } = data;
      const content = data.content;
      setConversations((conversations) => [
        ...conversations,
        {
          content,
          isSender: false,
        },
      ]);
    });
    return () => {
      socket.disconnect();
    };
  }, [profile._id]);
  const send = (e) => {
    e.preventDefault();
    setValue("");
    socket.emit("private message", {
      content: value,
      to: receiver, //user_id
    });
    setConversations((conversations) => [
      ...conversations,
      {
        content: value,
        isSender: true,
      },
    ]);
  };
  return (
    <div>
      <h1>Chat</h1>
      <div>
        {usernames.map((username) => (
          <>
            <div key={username.name}>
              <button onClick={() => getProfile(username.value)}>{username.name}</button>
            </div>
          </>
        ))}
      </div>
      <div className="chat">
        {conversations.map((message, index) => (
          <>
            <div key={index}>
              <div className="message-container">
                <div
                  className={
                    "message " + (message.isSender ? "message-right" : "")
                  }
                >
                  {message.content}
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
      <form onSubmit={send}>
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
