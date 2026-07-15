// src/controllers/categories.js
import * as categoryModel from "../models/categories.js";
import * as projectModel from "../models/projects.js";

async function categoryDetail(req, res) {
  try {
    const categoryId = req.params.id;

    const category = await categoryModel.getCategoryById(categoryId);
    const projects = await projectModel.getProjectsByCategoryId(categoryId);

    console.log("🔎 categoryDetail called with ID:", categoryId);
    console.log("➡️ Category data:", category);
    console.log("➡️ Projects data:", projects);

    if (!category) {
      return res.status(404).render("404", { 
        title: "Not Found", 
        message: "Category not found" 
      });
    }

    // Pass a title so header.ejs doesn’t crash
    res.render("category", { 
      title: category.name, 
      category, 
      projects 
    });
  } catch (err) {
    console.error("❌ Error in categoryDetail:", err);
    res.status(500).render("500", { 
      title: "Server Error", 
      error: err 
    });
  }
}

export default { categoryDetail };
