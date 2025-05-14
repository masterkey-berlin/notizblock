const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Speicherort für die Datendatei
const dataFilePath = path.join(__dirname, 'data', 'items.json');

// Verzeichnis erstellen, falls es nicht existiert
const dataDir = path.dirname(dataFilePath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Funktion zum Laden der Daten
function loadData() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    console.log('Daten aus items.json geladen');
    return JSON.parse(data);
  } catch (error) {
    console.log('items.json nicht gefunden, initialisiere mit leerem Array');
    return [];
  }
}

// Funktion zum Speichern der Daten
function saveData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Daten in items.json gespeichert');
}

let items = loadData();

// Middleware
app.use(express.json());

// Healthcheck-Endpunkt
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// API-Endpunkte
app.get('/api/items', (req, res) => {
    res.json(items);
});

app.post('/api/items', (req, res) => {
    const newItem = req.body;
    items.push(newItem);
    saveData(items);
    res.status(201).json(newItem);
});

app.delete('/api/items/:id', (req, res) => {
    const id = req.params.id;
    items = items.filter(item => item.id !== id);
    saveData(items);
    res.status(204).send();
});

// Catch-All-Route
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));