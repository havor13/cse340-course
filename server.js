import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// View engine
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => res.render('home', { title: 'Home' }));
app.get('/organizations', (req, res) => res.render('organizations', { title: 'Organizations' }));
app.get('/projects', (req, res) => res.render('projects', { title: 'Projects' }));
app.get('/categories', (req, res) => res.render('categories', { title: 'Categories' }));

// Example POST route (for forms)
app.post('/submit', (req, res) => {
  const { name, email } = req.body;
  res.render('success', { title: 'Form Submitted', name, email });
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
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
