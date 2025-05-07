import express from "express";
const itemsRouter = express.Router();

itemsRouter.get("/", (req, res) => {
  const items = [
    { id: 1, name: "Item 1", description: "Description for Item 1" },
    { id: 2, name: "Item 2", description: "Description for Item 2" },
    { id: 3, name: "Item 3", description: "Description for Item 3" },
  ];

  res.json(items);
});

export default itemsRouter;