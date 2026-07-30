// server.js
import { getAllOrganizations } from './src/models/organizations.js';
import db from './src/models/db.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import categoryRoutes from './src/routes/categories.js';
import projectRoutes from './src/routes/projects.js';
import organizationRoutes from "./src/routes/organizations.js";
import session from "express-session";
import flash from "connect-flash"; // ✅ use connect-flash

// Load environment variables
dotenv.config();
const SESSION_SECRET = process.env.SESSION_SECRET;

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Session middleware (required for flash)
app.use(session({
  secret: SESSION_SECRET || "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// ✅ Flash middleware
app.use(flash());

// ✅ Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Security & logging middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Routes
app.use("/", categoryRoutes);     
app.use("/projects", projectRoutes);        
app.use("/", organizationRoutes); 

// Home route
app.get('/', (req, res) => res.render('home', { title: 'Home' }));

// Organizations route
app.get('/organizations', async (req, res) => {
  try {
    const organizations = await getAllOrganizations();
    res.render('organizations', { title: 'Our Partner Organizations', organizations, errors: [] });
  } catch (error) {
    console.error('❌ Error fetching organizations:', error.message);
    req.flash("error", "Failed to load organizations.");
    res.redirect("/");
  }
});

// Categories route (list all categories)
app.get('/categories', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY category_id');
    res.render('categories', { title: 'Categories', categories: result.rows, errors: [] });
  } catch (error) {
    console.error('❌ Error fetching categories:', error.message);
    req.flash("error", "Failed to load categories.");
    res.redirect("/");
  }
});

// Example form submission route
app.post('/submit', (req, res) => {
  const { name, email } = req.body;
  res.render('success', { title: 'Form Submitted', name, email, errors: [] });
});

// DB test route
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW() as current_time');
    res.send('✅ Database connection successful: ' + result.rows[0].current_time);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    res.status(500).send('❌ Database connection failed: ' + error.message);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found', errors: [] });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  req.flash("error", "Server error occurred.");
  res.status(500).render('500', { title: 'Server Error', errors: [] });
});

// Start server
app.listen(PORT, () => {
  console.log("🚀 Starting server...");
  console.log(`📡 Listening on http://127.0.0.1:${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
});
