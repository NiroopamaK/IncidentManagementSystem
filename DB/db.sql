CREATE DATABASE IncidentManagementSystem;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(150) UNIQUE,
    email VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(20)
);

CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(20),
    created_by INTEGER REFERENCES users(id)
    assigned_to INTEGER REFERENCES users(id)
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER REFERENCES incidents(id),
    user_id INTEGER REFERENCES users(id),
    message TEXT
);