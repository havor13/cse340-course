
-- Organizations table
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- Projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  organization_id INT NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

-- Join table (many-to-many between projects and categories)
CREATE TABLE project_category (
  project_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (project_id, category_id),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Insert organizations
INSERT INTO organizations (name, description) VALUES
('Helping Hands', 'A community group focused on local outreach and support.'),
('Green Earth', 'Dedicated to environmental sustainability and conservation projects.'),
('Bright Future', 'Focused on education and youth empowerment initiatives.');

-- Insert projects
INSERT INTO projects (name, description, organization_id) VALUES
('Community Clean-Up', 'Volunteers gather to clean public spaces and promote civic pride.', 1),
('Literacy Program', 'Providing books and tutoring to improve literacy in underserved areas.', 3),
('Health Fair', 'Offering free screenings and wellness education to the community.', 1);

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Environmental', 'Projects focused on sustainability and protecting natural resources.'),
('Educational', 'Projects supporting learning, teaching, and academic growth.'),
('Community Service', 'Projects strengthening communities through volunteer work and outreach.'),
('Health and Wellness', 'Projects promoting physical, mental, and emotional well-being.');

-- Link projects to categories
INSERT INTO project_category (project_id, category_id) VALUES
(1, 3), -- Community Clean-Up → Community Service
(2, 2), -- Literacy Program → Educational
(3, 4); -- Health Fair → Health and Wellness
