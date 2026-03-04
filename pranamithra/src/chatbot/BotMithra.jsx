import { useState, useEffect } from "react";
import "./BotMithra.css";
import ChatWindow from "./ChatWindow";

export default function BotMithra({ user }) {

  const [isOpen, setIsOpen] = useState(false);

  /* 🔥 CLOSE BOT WHEN LOGIN MODAL OPENS */
  useEffect(() => {

    const handleAuthOpen = () => {
      setIsOpen(false);
    };

    window.addEventListener("open-auth-modal", handleAuthOpen);

    return () => {
      window.removeEventListener("open-auth-modal", handleAuthOpen);
    };

  }, []);

  return (
    <>
      <div
        className="bot-circle"
        onClick={() => setIsOpen(!isOpen)}
      >
        🤖
      </div>

      {isOpen && (
        <ChatWindow
          closeChat={() => setIsOpen(false)}
          user={user}
        />
      )}
    </>
  );
}