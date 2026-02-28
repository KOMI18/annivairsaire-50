import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

const MessagesGrid = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "voeux"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setMessages(data);
    });

    return () => unsubscribe();
  }, []);

  if (!messages.length) {
    return <div className="no-messages">Les messages apparaîtront ici.</div>;
  }

  return (
    <div className="messages-grid">
      {messages.map((m, i) => (
        <div key={i} className="message-card">
          <p className="message-author">
            {m.name}
            <span className="message-relation">{m.relation}</span>
          </p>
          <p className="message-text">{m.message}</p>
        </div>
      ))}
    </div>
  );
};

export default MessagesGrid;