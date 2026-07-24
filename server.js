// server.js
import { getAllOrganizations } from './src/models/organizations.js';
import db, { testConnection } from './src/models/db.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import categoryRoutes from './src/routes/categories.js';
import projectRoutes from './src/routes/projects.js'; // ✅ add projects router
import organizationRoutes from "./src/routes/organizations.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');

// Routes
app.use('/category', categoryRoutes);
app.use('/project', projectRoutes);   // ✅ detail routes
app.use('/projects', projectRoutes);  // ✅ list routes
app.use("/", organizationRoutes);


app.get('/', (req, res) => res.render('home', { title: 'Home' }));

// Organizations route using model function
app.get('/organizations', async (req, res) => {
  try {
    const organizations = await getAllOrganizations();
    res.render('organizations', { title: 'Our Partner Organizations', organizations });
  } catch (error) {
    console.error('❌ Error fetching organizations:', error.message);
    res.status(500).send('❌ Database error: ' + error.message);
  }
});

// Categories route (list all categories)
app.get('/categories', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY category_id');
    res.render('categories', { title: 'Categories', categories: result.rows });
  } catch (error) {
    console.error('❌ Error fetching categories:', error.message);
    res.status(500).send('❌ Database error: ' + error.message);
  }
});

app.post('/submit', (req, res) => {
  const { name, email } = req.body;
  res.render('success', { title: 'Form Submitted', name, email });
});

// Safer DB test route
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
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { title: 'Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log("🚀 Starting server...");
  console.log(`📡 Listening on http://127.0.0.1:${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
});