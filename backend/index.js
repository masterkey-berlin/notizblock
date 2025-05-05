const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Beispiel-API-Endpunkte
const items = [{ id: 1, name: 'Test Item' }];

app.get('/api/items', (req, res) => {
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const newItem = { id: items.length + 1, ...req.body };
  items.push(newItem);
  res.status(201).json(newItem);
});

app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});