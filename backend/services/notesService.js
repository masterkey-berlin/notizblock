import pool from "../utils/db.js";

export const createNote = async (name, description) => {
    const result = await pool.query(
        "INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *",
        [name, description]
    );
    return result.rows[0];
};

export const getAllNotes = async () => {
    const result = await pool.query("SELECT * FROM items");
    return result.rows;
};

export const deleteNote = async (id) => {
    await pool.query("DELETE FROM items WHERE id = $1", [id]);
};