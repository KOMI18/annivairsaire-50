import { Routes, Route } from "react-router-dom";
import Home         from "./pages/Home";
import Messages     from "./pages/Messages";
import MessagesList from "./pages/MessagesList";  // ← nouveau
import { useEffect } from "react";
import { CSS } from "./constants/css";

export default function App() {
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  return (
    <Routes>
      <Route path="/"              element={<Home />} />
      <Route path="/messages"      element={<Messages />} />
      <Route path="/messages-list" element={<MessagesList />} />
    </Routes>
  );
}