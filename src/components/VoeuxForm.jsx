import { useState } from "react";
import { db } from "../firebase-config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const VoeuxForm = () => {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    if (!name || !message) {
      setStatus("Veuillez renseigner votre prénom et votre message.");
      return;
    }

    try {
      setStatus("Envoi en cours...");
      await addDoc(collection(db, "voeux"), {
        name,
        relation,
        message,
        timestamp: serverTimestamp()
      });

      setStatus("Votre message a été envoyé.");
      setName("");
      setRelation("");
      setMessage("");
    } catch (err) {
      setStatus("Erreur lors de l'envoi.");
    }
  };

  return (
    <div className="voeux-form">
      <div className="form-row">
        <div className="form-group">
          <label>Votre prénom</label>
          <input value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Votre lien</label>
          <input value={relation} onChange={e => setRelation(e.target.value)} />
        </div>
      </div>

      <div className="form-group form-full">
        <label>Votre message</label>
        <textarea value={message} onChange={e => setMessage(e.target.value)} />
      </div>

      <button className="btn-submit" onClick={handleSubmit}>
        Envoyer mon message
      </button>

      <p className="form-status">{status}</p>
    </div>
  );
};

export default VoeuxForm;