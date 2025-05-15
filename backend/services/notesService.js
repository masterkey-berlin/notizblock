import pool from "../utils/db.js";

export const createNote = async (name, description) => {
    const result = await pool.query(
        "INSERT INTO notes (name, description) VALUES ($1, $2) RETURNING *",
        [name, description]
    );
    return result.rows[0];
};

export const getAllNotes = async () => {
    const result = await pool.query("SELECT * FROM notes");
    return result.rows;
};

export const deleteNote = async (id) => {
    await pool.query("DELETE FROM notes WHERE id = $1", [id]);
};

export const updateNote = async (id, name, description) => {
    const result = await pool.query(
        "UPDATE notes SET name = $1, description = $2 WHERE id = $3 RETURNING *",
        [name, description, id]
    );
    return result.rows[0];
};