import express from "express";
import categoryController from "../controllers/categories.js";

const router = express.Router();

// List all categories (already exists)
router.get("/", async (req, res) => {
  // your existing list logic
});

// Category detail
router.get("/:id", categoryController.categoryDetail);


export default router;
