// src/routes.js
import express from 'express';
import {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  requireRole,
  showDashboard,
  showUsersPage   // ✅ new controller for admin-only Users page
} from './controllers/users.js';

// ✅ Import controllers as default objects
import organizationController from './controllers/organizations.js';
import projectController, { projectValidation } from './controllers/projects.js';
import categoryController from './controllers/categories.js';

const router = express.Router();

// ✅ User registration & login
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.post('/logout', processLogout);

// ✅ Protected dashboard
router.get('/dashboard', requireLogin, showDashboard);

// ✅ Admin-only Users page
router.get('/users', requireLogin, requireRole('admin'), showUsersPage);

// ✅ Admin-only Organization routes
router.get('/new-organization', requireRole('admin'), organizationController.showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), organizationController.processNewOrganizationForm);
router.get('/edit-organization/:id', requireRole('admin'), organizationController.showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationController.updateOrganization);

// ✅ Admin-only Project routes
router.get('/new-project', requireRole('admin'), projectController.showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectController.processNewProjectForm);

router.get('/edit-project/:id', requireRole('admin'), projectController.showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectController.processEditProjectForm);

router.get('/project/:id/assign-categories', requireRole('admin'), projectController.showAssignCategoriesForm);
router.post('/project/:id/assign-categories', requireRole('admin'), projectController.processAssignCategoriesForm);

// ✅ Admin-only Category routes
router.get('/new-category', requireRole('admin'), categoryController.showNewCategoryForm);
router.post('/new-category', requireRole('admin'), categoryController.processNewCategoryForm);
router.get('/edit-category/:id', requireRole('admin'), categoryController.showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryController.updateCategory);

export default router;
