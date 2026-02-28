CREATE DATABASE IF NOT EXISTS IncidentManagementSystem;
USE IncidentManagementSystem;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(150) UNIQUE,
    email VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(20)
) ENGINE=InnoDB;

CREATE TABLE incidents (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(20),
    created_by INT,
    assigned_to INT,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE comments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    incident_id INT,
    user_id INT,
    message TEXT,
    FOREIGN KEY (incident_id) REFERENCES incidents(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;