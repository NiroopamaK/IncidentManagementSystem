Incident Reporting System

The Incident Reporting System (IRS) is a full-stack application designed to track, manage, and resolve incidents within an organization. 
It implements a role-based workflow with three types of users — Reporter, Reviewer, and Admin , each with specific responsibilities and permissions.

1️⃣ Project Overview

The Incident Reporting System (IRS) is a full-stack application built to track, manage, and resolve incidents in an organization. 
The system supports role-based access control with three types of users:

Reporter – creates incidents, assigns them to reviewers, and can edit or delete their own incidents.
Reviewer – receives assigned incidents, adds comments, and updates the status of incidents (Open → In Progress → Closed).
Admin – oversees all incidents and users, ensuring compliance, accountability, and workflow efficiency.

The system ensures secure authentication, role-based authorization, and auditable tracking of incident progress.

2️⃣ Key Features

1. Create, edit, and delete incidents (Reporter).
2. Assign incidents to Reviewers.
3. Comment on incidents and update status (Reviewer).
4. View all incidents and manage users (Admin).
5. JWT-based authentication for secure API access.
6. Dockerized full-stack deployment with MySQL database.

3️⃣ System Architecture

Frontend: Angular application, served via Docker (mapped to localhost:4200).
Backend: Spring Boot REST API, secured with JWT and Spring Security, role-based access control.
Database: MySQL (Docker volume for persistent storage).
Communication: Frontend calls backend API; backend handles authentication, authorization, and data persistence.

5️⃣ Docker Setup

- Access frontend: http://localhost:4200
- Access backend API: http://localhost:8080
Database persists in Docker volume db_data.

How to run:
    docker-compose build
    docker-compose up

6️⃣ API Documentation

All backend APIs for the Incident Reporting System are documented using **Swagger (OpenAPI)**.  
This includes all endpoints for authentication, users, incidents, and comments, along with request/response schemas, authorization requirements, and live testing.

Once the backend is running (port `8080`), you can view the API docs here:

[Swagger UI](http://localhost:8080/swagger-ui.html)

- Public endpoints: `/auth/**`, `/users/**`  
- Protected endpoints: `/incidents/**`, `/comments/**` (requires JWT)





