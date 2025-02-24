-- Create companies table
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    longitude DECIMAL(9,6),
    latitude DECIMAL(9,6),
    adress TEXT,
    size VARCHAR(255),
    domain VARCHAR(255)
);

-- Create technologies table
CREATE TABLE technologies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    UNIQUE (name, type)
);

-- Create job_types table
CREATE TABLE job_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Create domain table
CREATE TABLE domain (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Create company_technologies table
CREATE TABLE company_technologies (
    company_id INT NOT NULL,
    technology_id INT NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (technology_id) REFERENCES technologies(id)
);

-- Create company_job_types table
CREATE TABLE company_job_types (
    company_id INT NOT NULL,
    job_type_id INT NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (job_type_id) REFERENCES job_types(id)
);

-- Create company_domains table
CREATE TABLE company_domains (
    company_id INT NOT NULL,
    domain_id INT NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (domain_id) REFERENCES domain(id)
);