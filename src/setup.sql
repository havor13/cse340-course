-- Drop in dependency order
DROP TABLE IF EXISTS project_category;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organizations;

-- Organizations
CREATE TABLE organizations (
  organization_id SERIAL,
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  logo_filename VARCHAR(255) NOT NULL,
  CONSTRAINT pk_organizations PRIMARY KEY (organization_id),
  CONSTRAINT uq_org_email UNIQUE (contact_email)
);

-- Categories
CREATE TABLE categories (
  category_id SERIAL,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  CONSTRAINT pk_categories PRIMARY KEY (category_id),
  CONSTRAINT uq_category_name UNIQUE (name)
);

-- Projects
CREATE TABLE projects (
  project_id SERIAL,
  organization_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  project_date DATE NOT NULL,
  location VARCHAR(150) NOT NULL,
  CONSTRAINT pk_projects PRIMARY KEY (project_id),
  CONSTRAINT fk_projects_org FOREIGN KEY (organization_id)
    REFERENCES organizations(organization_id)
    ON DELETE CASCADE
);

-- Many-to-many relationship between projects and categories
CREATE TABLE project_category (
  project_id INT NOT NULL,
  category_id INT NOT NULL,
  CONSTRAINT pk_project_category PRIMARY KEY (project_id, category_id),
  CONSTRAINT fk_project FOREIGN KEY (project_id)
    REFERENCES projects(project_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_category FOREIGN KEY (category_id)
    REFERENCES categories(category_id)
    ON DELETE CASCADE
);

-- Seed organizations (15 total)
INSERT INTO organizations (name, description, contact_email, logo_filename) VALUES
('Helping Hands', 'Community outreach and support.', 'contact@helpinghands.org', 'org1.png'),
('Green Earth', 'Environmental sustainability projects.', 'info@greenearth.org', 'org2.png'),
('Bright Future', 'Education and youth empowerment.', 'hello@brightfuture.org', 'org3.png'),
('BrightFuture Builders', 'Community infrastructure development.', 'info@brightfuturebuilders.org', 'org4.png'),
('GreenHarvest Growers', 'Urban farming collective.', 'contact@greenharvest.org', 'org5.png'),
('UnityServe Volunteers', 'Volunteer coordination group.', 'hello@unityserve.org', 'org6.png'),
('TechBridge', 'Technology access for underserved communities.', 'info@techbridge.org', 'org7.png'),
('HealthFirst', 'Healthcare and wellness initiatives.', 'contact@healthfirst.org', 'org8.png'),
('EduConnect', 'Scholarship and tutoring programs.', 'hello@educonnect.org', 'org9.png'),
('SafeHaven', 'Shelter and support services.', 'info@safehaven.org', 'org10.png'),
('Food4All', 'Food distribution and hunger relief.', 'contact@food4all.org', 'org11.png'),
('CleanWaterNow', 'Water purification and distribution.', 'hello@cleanwater.org', 'org12.png'),
('SkillBuilders', 'Vocational training and job readiness.', 'info@skillbuilders.org', 'org13.png'),
('YouthSpark', 'Youth leadership and mentorship.', 'contact@youthspark.org', 'org14.png'),
('EcoFuture', 'Renewable energy and conservation.', 'hello@ecofuture.org', 'org15.png');

-- Seed categories
INSERT INTO categories (name, description) VALUES
('Education', 'Projects supporting learning and academic growth.'),
('Health', 'Projects promoting physical and mental well-being.'),
('Community Service', 'Volunteer work and outreach initiatives.'),
('Environment', 'Sustainability and conservation projects.');

-- Seed projects (with date + location)
INSERT INTO projects (organization_id, name, description, project_date, location) VALUES
(1, 'Community Clean-Up', 'Neighborhood cleanup and beautification.', '2026-05-01', 'Accra'),
(2, 'Tree Planting Drive', 'Planting 500 trees in local parks.', '2026-06-15', 'Kumasi'),
(3, 'Literacy Program', 'Tutoring and reading support for children.', '2026-07-10', 'Cape Coast'),
(8, 'Health Fair', 'Free health screenings and wellness education.', '2026-08-20', 'Takoradi'),
(11, 'Food Distribution', 'Weekly food packages for families.', '2026-09-05', 'Tamale');

-- Associate projects with categories
INSERT INTO project_category (project_id, category_id) VALUES
(1, 3), -- Community Clean-Up → Community Service
(1, 4), -- Community Clean-Up → Environment
(2, 4), -- Tree Planting Drive → Environment
(3, 1), -- Literacy Program → Education
(4, 2), -- Health Fair → Health
(5, 3); -- Food Distribution → Community Service

-- Verification queries
SELECT * FROM organizations;
SELECT * FROM categories;
SELECT * FROM projects;
SELECT * FROM project_category;
