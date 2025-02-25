-- DROP DATABASE IF EXISTS volo_db;
-- CREATE DATABASE volo_db;
-- \c volo_db;

DROP TABLE IF EXISTS person CASCADE;
CREATE TABLE person (
  id SERIAL PRIMARY KEY,
  gender INT NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  firstname VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS gender CASCADE;
CREATE TABLE gender (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS address CASCADE;
CREATE TABLE address (
  id SERIAL PRIMARY KEY,
  person INT NOT NULL,
  status INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  careof VARCHAR(50),
  country INT NOT NULL,
  state VARCHAR(50),
  street VARCHAR(50) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  city VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS contact CASCADE;
CREATE TABLE contact (
  id SERIAL PRIMARY KEY,
  person INT NOT NULL,
  type INT NOT NULL,
  val VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS contact_type CASCADE;
CREATE TABLE contact_type (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS "user" CASCADE;
CREATE TABLE "user" (
  email VARCHAR(50) PRIMARY KEY,
  person INT NOT NULL,
  secret VARCHAR(100) NOT NULL,
  organisational_role VARCHAR(50),
  avatar TEXT
);

DROP TABLE IF EXISTS user_role CASCADE;
CREATE TABLE user_role (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS user_role_mapping CASCADE;
CREATE TABLE user_role_mapping (
  "user" VARCHAR(50) NOT NULL,
  user_role INT NOT NULL
);

DROP TABLE IF EXISTS contract CASCADE;
CREATE TABLE contract (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  volunteer INT NOT NULL,
  program INT NOT NULL,
  project INT NOT NULL,
  contact_person_of_project INT,
  start DATE NOT NULL,
  "end" DATE NOT NULL,
  visa_necessary BOOLEAN NOT NULL,
  incoming_volunteer BOOLEAN NOT NULL,
  salary INT NOT NULL,
  holiday INT NOT NULL,
  seminar_days INT NOT NULL,
  sick_days INT NOT NULL,
  metadata JSON
);

DROP TABLE IF EXISTS legal_guardian CASCADE;
CREATE TABLE legal_guardian (
  id SERIAL PRIMARY KEY,
  contract INT NOT NULL,
  address INT NOT NULL
);

DROP TABLE IF EXISTS volunteer CASCADE;
CREATE TABLE volunteer (
  id SERIAL PRIMARY KEY,
  organisational_id VARCHAR(50) NOT NULL,
  person INT NOT NULL,
  created TIMESTAMP NOT NULL,
  status INT NOT NULL,
  birthday DATE,
  birthplace VARCHAR(50),
  nationality INT,
  social_insurance_number VARCHAR(50),
  health_insurance INT,
  tax_number VARCHAR(50),
  religion INT,
  bank_name VARCHAR(50),
  iban VARCHAR(22),
  bic VARCHAR(11),
  account_holder VARCHAR(50),
  level_of_school_edu INT,
  level_of_vocational_edu INT,
  ongoing_legal_proceedings BOOLEAN,
  avatar TEXT
);

DROP TABLE IF EXISTS editing_history CASCADE;
CREATE TABLE editing_history (
  id SERIAL PRIMARY KEY,
  editing_type INT NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  "user" VARCHAR(50) NOT NULL,
  volunteer INT NOT NULL,
  field VARCHAR(50) NOT NULL,
  value VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS editing_type CASCADE;
CREATE TABLE editing_type (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50)
);

DROP TABLE IF EXISTS volunteer_status CASCADE;
CREATE TABLE volunteer_status (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS health_insurance CASCADE;
CREATE TABLE health_insurance (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  web VARCHAR(255),
  fee DOUBLE PRECISION NOT NULL,
  additional_info VARCHAR(512)
);

-- Comments for health_insurance-table
COMMENT ON COLUMN health_insurance.name IS 'Full name of Insurance.';
COMMENT ON COLUMN health_insurance.web IS 'Website of Insurance.';
COMMENT ON COLUMN health_insurance.fee IS 'Zusatzbeitrag in Prozent';
COMMENT ON COLUMN health_insurance.additional_info IS 'Geöffnet in';

DROP TABLE IF EXISTS religion CASCADE;
CREATE TABLE religion (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  shorthand VARCHAR(2) NOT NULL
);

DROP TABLE IF EXISTS school_edu CASCADE;
CREATE TABLE school_edu (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS vocational_edu CASCADE;
CREATE TABLE vocational_edu (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS contract_modification CASCADE;
CREATE TABLE contract_modification (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  status INT NOT NULL,
  contract INT NOT NULL,
  type INT NOT NULL,
  into_force_from DATE NOT NULL,
  value VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS contract_modification_status CASCADE;
CREATE TABLE contract_modification_status (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS contract_modification_type CASCADE;
CREATE TABLE contract_modification_type (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS salary CASCADE;
CREATE TABLE salary (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(250),
  pocket_money DOUBLE PRECISION NOT NULL,
  free_of_charge_service DOUBLE PRECISION NOT NULL,
  food_allowance DOUBLE PRECISION NOT NULL,
  free_of_charge_food DOUBLE PRECISION NOT NULL,
  accommodation_allowance DOUBLE PRECISION NOT NULL,
  free_of_charge_accommodation DOUBLE PRECISION NOT NULL,
  insurance_contributions DOUBLE PRECISION NOT NULL
);

DROP TABLE IF EXISTS program CASCADE;
CREATE TABLE program (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  shorthand VARCHAR(10) NOT NULL
);

DROP TABLE IF EXISTS country CASCADE;
CREATE TABLE country (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  iso2 VARCHAR(2) NOT NULL,
  iso3 VARCHAR(3),
  local_name VARCHAR(50),
  continent TEXT CHECK (continent IN ('Africa', 'Antarctica', 'Asia', 'Europe', 'Oceania', 'North America', 'South America')),
  nationality VARCHAR(50)
);

-- Comments for country-table
COMMENT ON COLUMN country.name IS 'Full country name.';
COMMENT ON COLUMN country.iso2 IS 'ISO 3166-1 alpha-2 code.';
COMMENT ON COLUMN country.iso3 IS 'ISO 3166-1 alpha-3 code.';
COMMENT ON COLUMN country.local_name IS 'Local variation of the name.';
COMMENT ON COLUMN country.continent IS 'Continent of the country.';
COMMENT ON COLUMN country.nationality IS 'Nationality in German language.';

DROP TABLE IF EXISTS project CASCADE;
CREATE TABLE project (
  id SERIAL PRIMARY KEY,
  organisational_id VARCHAR(50),
  name VARCHAR(50) NOT NULL,
  shorthand VARCHAR(32) NOT NULL,
  description TEXT,
  capacity INT NOT NULL,
  careof VARCHAR(50),
  country INT NOT NULL,
  state VARCHAR(50),
  street VARCHAR(50) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  city VARCHAR(50) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS contact_person CASCADE;
CREATE TABLE contact_person (
  id SERIAL PRIMARY KEY,
  person INT NOT NULL,
  project INT NOT NULL
);

DROP TABLE IF EXISTS project_role CASCADE;
CREATE TABLE project_role (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS project_role_mapping CASCADE;
CREATE TABLE project_role_mapping (
  contact_person INT NOT NULL,
  project_role INT NOT NULL
);

DROP TABLE IF EXISTS volunteer_note CASCADE;
CREATE TABLE volunteer_note (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  volunteer INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  note TEXT NOT NULL,
  "user" VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS volunteer_document CASCADE;
CREATE TABLE volunteer_document (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  name VARCHAR(50) NOT NULL,
  volunteer INT NOT NULL,
  type INT NOT NULL,
  size INT NOT NULL,
  path TEXT NOT NULL,
  "user" VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS volunteer_document_type CASCADE;
CREATE TABLE volunteer_document_type (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
);

-- Add foreign keys
ALTER TABLE "user" ADD FOREIGN KEY (person) REFERENCES person (id);
ALTER TABLE user_role_mapping ADD FOREIGN KEY ("user") REFERENCES "user" (email);
ALTER TABLE user_role_mapping ADD FOREIGN KEY (user_role) REFERENCES user_role (id);
ALTER TABLE person ADD FOREIGN KEY (gender) REFERENCES gender (id);
ALTER TABLE address ADD FOREIGN KEY (person) REFERENCES person (id);
ALTER TABLE address ADD FOREIGN KEY (country) REFERENCES country (id);
ALTER TABLE contact ADD FOREIGN KEY (type) REFERENCES contact_type (id);
ALTER TABLE contact ADD FOREIGN KEY (person) REFERENCES person (id);
ALTER TABLE legal_guardian ADD FOREIGN KEY (contract) REFERENCES contract (id);
ALTER TABLE legal_guardian ADD FOREIGN KEY (address) REFERENCES address (id);
ALTER TABLE volunteer ADD FOREIGN KEY (person) REFERENCES person (id);
ALTER TABLE volunteer ADD FOREIGN KEY (status) REFERENCES volunteer_status (id);
ALTER TABLE volunteer ADD FOREIGN KEY (nationality) REFERENCES country (id);
ALTER TABLE volunteer ADD FOREIGN KEY (level_of_school_edu) REFERENCES school_edu (id);
ALTER TABLE volunteer ADD FOREIGN KEY (level_of_vocational_edu) REFERENCES vocational_edu (id);
ALTER TABLE volunteer ADD FOREIGN KEY (health_insurance) REFERENCES health_insurance (id);
ALTER TABLE volunteer ADD FOREIGN KEY (religion) REFERENCES religion (id);
ALTER TABLE editing_history ADD FOREIGN KEY (volunteer) REFERENCES volunteer (id);
ALTER TABLE editing_history ADD FOREIGN KEY ("user") REFERENCES "user" (email);
ALTER TABLE editing_history ADD FOREIGN KEY (editing_type) REFERENCES editing_type (id);
ALTER TABLE contract ADD FOREIGN KEY (volunteer) REFERENCES volunteer (id);
ALTER TABLE contract ADD FOREIGN KEY (program) REFERENCES program (id);
ALTER TABLE contract ADD FOREIGN KEY (project) REFERENCES project (id);
ALTER TABLE contract ADD FOREIGN KEY (salary) REFERENCES salary (id);
ALTER TABLE contract ADD FOREIGN KEY (contact_person_of_project) REFERENCES contact_person (id);
ALTER TABLE contract_modification ADD FOREIGN KEY (type) REFERENCES contract_modification_type (id);
ALTER TABLE contract_modification ADD FOREIGN KEY (contract) REFERENCES contract (id);
ALTER TABLE contact_person ADD FOREIGN KEY (person) REFERENCES person (id);
ALTER TABLE contact_person ADD FOREIGN KEY (project) REFERENCES project (id);
ALTER TABLE project_role_mapping ADD FOREIGN KEY (contact_person) REFERENCES contact_person (id);
ALTER TABLE project_role_mapping ADD FOREIGN KEY (project_role) REFERENCES project_role (id);
ALTER TABLE project ADD FOREIGN KEY (country) REFERENCES country (id);
ALTER TABLE contract_modification ADD FOREIGN KEY (status) REFERENCES contract_modification_status (id);
ALTER TABLE volunteer_note ADD FOREIGN KEY (volunteer) REFERENCES volunteer (id);
ALTER TABLE volunteer_note ADD FOREIGN KEY ("user") REFERENCES "user" (email);
ALTER TABLE volunteer_document ADD FOREIGN KEY (volunteer) REFERENCES volunteer (id);
ALTER TABLE volunteer_document ADD FOREIGN KEY (type) REFERENCES volunteer_document_type (id);
ALTER TABLE volunteer_document ADD FOREIGN KEY ("user") REFERENCES "user" (email);
