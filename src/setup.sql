-- Drop in dependency order
DROP TABLE IF EXISTS project_category;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organizations;

-- Organizations
CREATE TABLE organizations (
  organization_id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  logo_filename VARCHAR(255) NOT NULL
);

-- Categories
CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

-- Projects
CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  organization_id INT REFERENCES organizations(organization_id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL
);

-- Many-to-many relationship between projects and categories
CREATE TABLE project_category (
  project_id INT REFERENCES projects(project_id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(category_id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, category_id)
);

-- Seed organizations
INSERT INTO organizations (name, description, contact_email, logo_filename)
VALUES
('Helping Hands', 'A nonprofit dedicated to organizing community service projects and volunteer opportunities.', 'contact@helpinghands.org', 'helpinghands-logo.png'),
('Green Earth', 'An environmental group focused on sustainability, conservation, and eco-friendly initiatives.', 'info@greenearth.org', 'greenearth-logo.png'),
('Bright Future', 'An educational charity supporting literacy programs and youth mentorship.', 'hello@brightfuture.org', 'brightfuture-logo.png'),
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- Seed categories
INSERT INTO categories (name) VALUES
('Education'),
('Health'),
('Community Service'),
('Environment');

-- Seed projects
INSERT INTO projects (organization_id, name, description)
VALUES
(1, 'Community Clean-Up', 'Neighborhood cleanup and beautification project.'),
(1, 'Health Fair', 'Free health screenings and wellness education.'),
(3, 'Literacy Program', 'Tutoring and reading support for children.');

-- Associate projects with categories
INSERT INTO project_category (project_id, category_id) VALUES
(1, 3), -- Community Clean-Up → Community Service
(1, 4), -- Community Clean-Up → Environment
(2, 2), -- Health Fair → Health
(3, 1); -- Literacy Program → Education

SELECT * FROM organizations;
SELECT * FROM categories;
SELECT * FROM projects;
SELECT * FROM project_category;
