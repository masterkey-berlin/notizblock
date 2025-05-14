// filepath: src/App.jsx
import React, { useState, useEffect } from "react";

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [discripition, setDiscripition] = useState("");
 

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/items`)
      .then((response) => response.json())
      .then((data) => 
        {console.log(data)
        setNotes(data.map(item => ({name: item.name, discripition: item.discripition})))
      
        });
      

  }, [apiUrl]);

  const addNote = () => {
    if (note.trim() === "") return;

    setNotes([...notes, {note, discripition}]);
    setNote();

    // Send the new note to the backend
    fetch(`${apiUrl}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: note, discripition }),
    });
  }     
 
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
        placeholder="Notiz..."
        style={{ padding: "10px", width: "300px", marginRight: "10px" }}
      />
      <input
        type="text"
        value={discripition}
        onChange={(e) => setDiscripition(e.target.value)}
        placeholder="Beschreibung..."
        style={{ padding: "10px", width: "300px", marginRight: "10px" }}
      />
      <button onClick={addNote} style={{ padding: "10px" }}>
        Hinzufügen
      </button>
      <ul style={{ marginTop: "20px" }}>
        {notes.map((note, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            {note.name}{"/"}
            {note.discripition}
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
