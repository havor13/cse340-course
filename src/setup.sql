-- Reset existing tables
DROP TABLE IF EXISTS project_category;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organizations;

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
    organization_id INT REFERENCES organizations(id) ON DELETE CASCADE
);

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Join table for many-to-many relationship
CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
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
INSERT INTO categories (name) VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');

-- Associate projects with categories
INSERT INTO project_category (project_id, category_id) VALUES
(1, 1), -- Community Clean-Up → Environmental
(1, 3), -- Community Clean-Up → Community Service
(2, 2), -- Literacy Program → Educational
(3, 4), -- Health Fair → Health and Wellness
(3, 3); -- Health Fair → Community Service
