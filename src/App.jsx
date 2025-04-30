// filepath: src/App.jsx
import React, { useState } from "react";

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  const addNote = () => {
    if (note.trim()) {
      setNotes([...notes, note]);
      setNote("");
    }
  };

  const deleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Notizblock</h1>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Neue Notiz..."
        style={{ padding: "10px", width: "300px", marginRight: "10px" }}
      />
      <button onClick={addNote} style={{ padding: "10px" }}>
        Hinzufügen
      </button>
      <ul style={{ marginTop: "20px" }}>
        {notes.map((n, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            {n}{" "}
            <button
              onClick={() => deleteNote(index)}
              style={{
                marginLeft: "10px",
                color: "white",
                backgroundColor: "red",
                border: "none",
                padding: "5px",
                cursor: "pointer",
              }}
            >
              Löschen
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
