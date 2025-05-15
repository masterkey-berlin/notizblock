import express from "express";
import { createNote, getAllNotes, deleteNote, updateNote } from "../services/notesService.js";

const itemsRouter = express.Router();

// GET: Alle Items abrufen
itemsRouter.get("/", async (req, res, next) => {
    try {
        const items = await getAllNotes();
        res.json(items);
    } catch (err) {
        next(err);
    }
});

// POST: Neues Item hinzufügen
itemsRouter.post("/", async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const newItem = await createNote(name, description);
        res.status(201).json(newItem);
    } catch (err) {
        next(err);
    }
});

// DELETE: Item löschen
itemsRouter.delete("/:id", async (req, res, next) => {
    try {
        await deleteNote(req.params.id);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

//Update Function
itemsRouter.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // Überprüfen, ob die ID vorhanden ist
        if (!id) {
            return res.status(400).json({ error: "Fehlende ID in der Anfrage" });
        }

        const updatedItem = await updateNote(id, name, description);

        if (!updatedItem) {
            return res.status(404).json({ error: "Notiz nicht gefunden" });
        }

        res.status(200).json(updatedItem);
    } catch (err) {
        next(err);
    }
});

export default itemsRouter;