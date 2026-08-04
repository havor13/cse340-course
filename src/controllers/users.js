// src/controllers/users.js
import bcrypt from "bcrypt";
import db from "../models/db.js";
import { createUser, authenticateUser } from "../models/users.js";
import * as volunteerModel from "../models/volunteers.js"; // ✅ import volunteer model

// ✅ Show the registration form
const showUserRegistrationForm = (req, res) => {
  res.render("register", { title: "Register" });
};

// ✅ Handle registration logic
const processUserRegistrationForm = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await createUser(name, email, passwordHash);

    req.flash("success", "Registration successful! Please log in.");
    res.redirect("/");
  } catch (error) {
    console.error("Error registering user:", error);
    req.flash("error", "An error occurred during registration. Please try again.");
    res.redirect("/register");
  }
};

// ✅ Show the login form
const showLoginForm = (req, res) => {
  res.render("login", { title: "Login" });
};

// ✅ Handle login logic
const processLoginForm = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);
    if (user) {
      req.session.user = user;
      req.flash("success", "Login successful!");
      console.log("User logged in:", user);

      res.redirect("/dashboard");
    } else {
      req.flash("error", "Invalid email or password.");
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error during login:", error);
    req.flash("error", "An error occurred during login. Please try again.");
    res.redirect("/login");
  }
};

// ✅ Handle logout logic
const processLogout = (req, res) => {
  req.flash("success", "Logout successful!");
  req.session.destroy(err => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).render("500", { title: "Server Error", errors: ["Logout failed"] });
    }
    res.redirect("/login");
  });
};

// ✅ Middleware to protect routes (login required)
const requireLogin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.flash("error", "You must be logged in to access that page.");
    return res.redirect("/login");
  }
  next();
};

// ✅ Middleware factory to protect routes by role
const requireRole = role => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      req.flash("error", "You must be logged in to access this page.");
      return res.redirect("/login");
    }

    if (req.session.user.role_name !== role) {
      req.flash("error", "You do not have permission to access this page.");
      return res.redirect("/dashboard");
    }

    next();
  };
};

// ✅ Show dashboard page (with volunteer projects)
const showDashboard = async (req, res) => {
  try {
    const user = req.session.user;
    let volunteers = [];

    if (user) {
      volunteers = await volunteerModel.getUserVolunteers(user.user_id);
    }

    res.render("dashboard", {
      title: "Dashboard",
      name: user.name,
      email: user.email,
      role: user.role_name,
      user,
      volunteers,          // ✅ always defined
      messages: req.flash()
    });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    req.flash("error", "Failed to load dashboard.");
    res.redirect("/");
  }
};

// ✅ Show users page (admin-only)
const showUsersPage = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT u.name, u.email, r.role_name
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      ORDER BY u.name
    `);

    res.render("users", {
      title: "Registered Users",
      users: result.rows,
      errors: []
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    req.flash("error", "Failed to load users.");
    res.redirect("/dashboard");
  }
};

export {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  requireRole,
  showDashboard,
  showUsersPage
};
