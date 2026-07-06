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
('Helping Hands', 'A community group focused on local outreach and support.', 'contact@helpinghands.org', 'org1.png'),
('Green Earth', 'Dedicated to environmental sustainability and conservation projects.', 'info@greenearth.org', 'org2.png'),
('Bright Future', 'Focused on education and youth empowerment initiatives.', 'hello@brightfuture.org', 'org3.png'),
('BrightFuture Builders', 'Improving community infrastructure through sustainable construction.', 'info@brightfuturebuilders.org', 'org4.png'),
('GreenHarvest Growers', 'Urban farming collective promoting food sustainability.', 'contact@greenharvest.org', 'org5.png'),
('UnityServe Volunteers', 'Volunteer coordination group supporting local charities.', 'hello@unityserve.org', 'org6.png');

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

ALTER TABLE categories
ADD COLUMN description TEXT;

UPDATE categories SET description = 'Projects focused on sustainability and protecting natural resources.'
WHERE name = 'Environment';

UPDATE categories SET description = 'Projects supporting learning, teaching, and academic growth.'
WHERE name = 'Education';

UPDATE categories SET description = 'Projects strengthening communities through volunteer work and outreach.'
WHERE name = 'Community Service';

UPDATE categories SET description = 'Projects promoting physical, mental, and emotional well-being.'
WHERE name = 'Health';