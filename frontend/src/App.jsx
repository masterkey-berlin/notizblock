// filepath: src/App.jsx
import React, { useState, useEffect } from "react";

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [description, setDescription] = useState("");
 

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/items`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setNotes(data.map((item) => ({ name: item.name, description: item.description })));
      });
  }, [apiUrl]);

  const addNote = () => {
    if (!note || note.trim() === "") {
      console.error("Note cannot be empty");
      return;
    }

    setNotes([...notes, { name: note.trim(), description: description.trim() }]);
    setNote("");
    setDescription("");

    // Send the new note to the backend
    fetch(`${apiUrl}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: note.trim(), description: description.trim() }),
    });
  }     
 
  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);

    // Send the delete request to the backend
    fetch(`${apiUrl}/items/${index}`, {
      method: "DELETE",
    });
  };

  const updateNote = (index) => {
    const noteToUpdate = notes[index];

    // Überprüfen, ob die ID vorhanden ist
    if (!noteToUpdate.id) {
        console.error("Fehlende ID für die Notiz", noteToUpdate);
        return;
    }

    // Sende die Änderungen direkt an das Backend
    fetch(`${apiUrl}/items/${noteToUpdate.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(noteToUpdate),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Fehler beim Aktualisieren der Notiz");
        }
        return response.json();
    })
    .then((updatedNote) => {
        // Aktualisiere die Notiz im Zustand mit der Antwort des Backends
        const newNotes = [...notes];
        newNotes[index] = updatedNote;
        setNotes(newNotes);
    })
    .catch((error) => {
        console.error("Update fehlgeschlagen:", error);
    });
};

  const handleInputChange = (index, field, value) => {
    const updatedNotes = [...notes];
    updatedNotes[index][field] = value || ""; // Ensure value is not undefined
    setNotes(updatedNotes);
  };

  const saveNote = (index) => {
    const noteToSave = notes[index];

    // Send the updated note to the backend
    fetch(`${apiUrl}/items/${index}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noteToSave),
    });
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
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Beschreibung..."
        style={{ padding: "10px", width: "300px", marginRight: "10px" }}
      />
      <button onClick={addNote} style={{ padding: "10px" }}>
        Hinzufügen
      </button>
      <ul style={{ marginTop: "20px" }}>
        {notes.map((note, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            <input
              type="text"
              value={note.name}
              onChange={(e) => handleInputChange(index, "name", e.target.value)}
              style={{ padding: "5px", marginRight: "10px" }}
            />
            <input
              type="text"
              value={note.description}
              onChange={(e) => handleInputChange(index, "description", e.target.value)}
              style={{ padding: "5px", marginRight: "10px" }}
            />
            <button
              onClick={() => updateNote(index)}
              style={{
                marginLeft: "10px",
                color: "white",
                backgroundColor: "blue",
                border: "none",
                padding: "5px",
                cursor: "pointer",
              }}
            >
              Speichern
            </button>
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
