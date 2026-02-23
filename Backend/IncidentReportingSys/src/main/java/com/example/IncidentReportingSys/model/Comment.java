package com.example.IncidentReportingSys.model;

import jakarta.persistence.*;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // serial / auto-increment
    private int id;

    @Column(name = "incidentId")
    private int incidentId;

    @Column(name = "userId")
    private int userId;

    private String message;

    public Comment() {
        // default constructor for JPA
    }

    public Comment(int id, int incidentId, int userId, String message) {
        this.id = id;
        this.incidentId = incidentId;
        this.userId = userId;
        this.message = message;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getIncidentId() {
        return incidentId;
    }

    public void setIncidentId(int incidentId) {
        this.incidentId = incidentId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}