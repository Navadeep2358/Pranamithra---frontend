import { useState, useRef, useEffect } from "react";
import "./ChatWindow.css";

export default function ChatWindow({ closeChat, user }) {

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I am Bot-Mithra. Type hi to begin."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isQueryMode, setIsQueryMode] = useState(false);   // ✅ NEW
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */

  const sendMessage = async (text) => {

    if (!text || !text.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text }]);
    setInput("");

    if (!user) {
      handleLex(text);
      return;
    }

    if (user.role === "doctor") {
      handleDoctorBot(text);
    }

    if (user.role === "customer") {
      handleCustomerBot(text);
    }
  };

  /* ================= DOCTOR MENU ================= */

  const showDoctorMenu = () => {
    setMessages(prev => [
      ...prev,
      {
        sender: "bot",
        text: "What would you like to do next?",
        buttons: [
          { label: "My Slots", value: "MY_SLOTS" },
          { label: "My Appointments", value: "MY_APPOINTMENTS" },
          { label: "Send Queries", value: "SEND_QUERY" },   // ✅ ADDED
          { label: "End Chat", value: "END_CHAT" }
        ]
      }
    ]);
  };

  /* ================= DOCTOR BOT ================= */

  const handleDoctorBot = async (text) => {

    const lower = text.toLowerCase();

    if (lower === "hi" || lower === "hello") {

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: `Hello Dr. ${user.name}, welcome to Pranamithra 👋`,
          buttons: [
            { label: "My Slots", value: "MY_SLOTS" },
            { label: "My Appointments", value: "MY_APPOINTMENTS" },
            { label: "Send Queries", value: "SEND_QUERY" },  // ✅ ADDED
            { label: "End Chat", value: "END_CHAT" }
          ]
        }
      ]);

      return;
    }

    /* ================= SEND QUERY ================= */

    if (text === "SEND_QUERY") {

      setIsQueryMode(true);

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: "Please type your query and press Send."
        }
      ]);

      return;
    }

    /* If query mode active → store message in DB */
    if (isQueryMode) {

      try {

        await fetch("http://localhost:3000/api/send-query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ message: text })
        });

        setMessages(prev => [
          ...prev,
          { sender: "bot", text: "Your query has been submitted successfully ✅" }
        ]);

        setIsQueryMode(false);
        showDoctorMenu();

      } catch {

        setMessages(prev => [
          ...prev,
          { sender: "bot", text: "Failed to submit query." }
        ]);

        setIsQueryMode(false);
        showDoctorMenu();
      }

      return;
    }

    /* ================= MY APPOINTMENTS ================= */

    if (text === "MY_APPOINTMENTS") {

      try {

        const res = await fetch(
          "http://localhost:3000/doctor/appointments",
          { credentials: "include" }
        );

        const data = await res.json();

        if (!data.length) {
          setMessages(prev => [
            ...prev,
            { sender: "bot", text: "No appointments found." }
          ]);
          showDoctorMenu();
          return;
        }

        const appointmentCards = data.map(app => ({
          sender: "bot",
          customAppointment: {
            id: app.id,
            name: app.customer_name,
            date: app.appointment_date,
            slot: app.slot_time
          }
        }));

        setMessages(prev => [...prev, ...appointmentCards]);
        showDoctorMenu();

      } catch {
        setMessages(prev => [
          ...prev,
          { sender: "bot", text: "Unable to fetch appointments." }
        ]);
        showDoctorMenu();
      }

      return;
    }

    if (text.startsWith("VIEW_APPOINTMENT_")) {

      window.dispatchEvent(
        new CustomEvent("go-to-doctor-appointments")
      );

      closeChat();
      return;
    }

    /* ================= MY SLOTS ================= */

    if (text === "MY_SLOTS") {

      try {

        const res = await fetch(
          "http://localhost:3000/doctor/available-dates",
          { credentials: "include" }
        );

        const data = await res.json();

        if (!data.dates || data.dates.length === 0) {
          setMessages(prev => [
            ...prev,
            { sender: "bot", text: "No slots scheduled." }
          ]);
          showDoctorMenu();
          return;
        }

        setMessages(prev => [
          ...prev,
          {
            sender: "bot",
            text: "Select a date:",
            buttons: data.dates.map(d => ({
              label: d,
              value: d
            }))
          }
        ]);

      } catch {
        setMessages(prev => [
          ...prev,
          { sender: "bot", text: "Unable to fetch dates." }
        ]);
        showDoctorMenu();
      }

      return;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {

      try {

        const res = await fetch(
          `http://localhost:3000/doctor/dashboard?date=${text}`,
          { credentials: "include" }
        );

        const data = await res.json();

        setMessages(prev => [
          ...prev,
          {
            sender: "bot",
            text: "Available Slots:",
            slotList: data.available || []
          },
          {
            sender: "bot",
            text: "Booked Slots:",
            slotList: data.booked?.map(b => b.slot_time) || []
          }
        ]);

        showDoctorMenu();

      } catch {
        setMessages(prev => [
          ...prev,
          { sender: "bot", text: "Unable to fetch slots." }
        ]);
        showDoctorMenu();
      }

      return;
    }

    if (text === "END_CHAT") {
      closeChat();
    }
  };

  /* ================= CUSTOMER BOT ================= */

  const handleCustomerBot = (text) => {

    if (text === "END_CHAT") {
      closeChat();
    }
  };

  /* ================= LEX HANDLER ================= */

  const handleLex = async (text) => {

    setLoading(true);

    try {

      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();

      if (data.openAuth) {
        window.dispatchEvent(
          new CustomEvent("open-auth-modal", {
            detail: data.openAuth
          })
        );
        closeChat();
        setLoading(false);
        return;
      }

      const newMsg = {
        sender: "bot",
        text: data.reply
      };

      if (data.buttons) {
        newMsg.buttons = data.buttons;
      }

      setMessages(prev => [...prev, newMsg]);

    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Bot unavailable." }
      ]);
    }

    setLoading(false);
  };

  /* ================= UI ================= */

  return (
    <div className="chat-wrapper">
      <div className="chat-container">

        <div className="chat-header">
          <span>Bot-Mithra</span>
          <button onClick={closeChat}>✖</button>
        </div>

        <div className="chat-body">

          {messages.map((msg, index) => (
            <div key={index} className={`message-row ${msg.sender}`}>
              <div className={`message-bubble ${msg.sender}`}>

                {msg.text}

                {msg.buttons && (
                  <div className="button-container">
                    {msg.buttons.map((btn, i) => (
                      <button
                        key={i}
                        className="chat-btn"
                        onClick={() => sendMessage(btn.value)}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}

                {msg.slotList && (
                  <div className="slot-grid">
                    {msg.slotList.length === 0
                      ? "No slots"
                      : msg.slotList.map((slot, i) => (
                          <div key={i} className="slot-item">
                            {slot}
                          </div>
                        ))}
                  </div>
                )}

                {msg.customAppointment && (
                  <div className="appointment-card">
                    <div className="appointment-info">
                      <div><strong>👤 {msg.customAppointment.name}</strong></div>
                      <div>📅 {msg.customAppointment.date}</div>
                      <div>⏰ {msg.customAppointment.slot}</div>
                    </div>

                    <button
                      className="view-btn"
                      onClick={() =>
                        sendMessage(
                          `VIEW_APPOINTMENT_${msg.customAppointment.id}`
                        )
                      }
                    >
                      View
                    </button>
                  </div>
                )}

              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row bot">
              <div className="message-bubble bot">Typing...</div>
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>

        <div className="chat-footer">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage(input);
            }}
            placeholder="Type your message..."
          />
          <button
            className="send-btn"
            onClick={() => sendMessage(input)}
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}