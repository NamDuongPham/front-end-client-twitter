import { useEffect } from "react";
import { io } from "socket.io-client";

export default function ChatDemo() {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL); //VITE_API_URL="http://localhost:4000"
    socket.on("connect", () => {
      console.log(socket.id);
      socket.emit("hello server",{
        message: `Hi server đã kết nối thành công`
      });
      socket.on("hi", (data) => {
        console.log(data);
      });
    });

    socket.on("disconnect", () => {
      console.log(socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return <div>Chat</div>;
}
