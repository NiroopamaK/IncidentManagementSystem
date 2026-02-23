package com.example.IncidentReportingSys.model;

import jakarta.persistence.*;

@Entity
@Table(name = "incidents")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // serial / auto-increment
    private int id;

    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private Status status; // e.g., OPEN, IN_PROGRESS, CLOSED

    @Column(name = "createdBy")
    private int createdBy; // user ID of creator

    @Column(name = "assignedTo")
    private int assignedTo; // user ID of assignee

    public Incident() {
        // default constructor for JPA
    }

    public Incident(int id, String title, String description, Status status, int createdBy, int assignedTo) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.createdBy = createdBy;
        this.assignedTo = assignedTo;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public int getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(int createdBy) {
        this.createdBy = createdBy;
    }

    public int getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(int assignedTo) {
        this.assignedTo = assignedTo;
    }
}