package com.example.IncidentReportingSys.repository;

import com.example.IncidentReportingSys.model.Incident;
import com.example.IncidentReportingSys.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Integer> {

    // Optional: find incidents by status
    List<Incident> findByStatus(Status status);

    // Optional: find incidents assigned to a specific user
    List<Incident> findByAssignedTo(int userId);

    // Optional: find incidents created by a specific user
    List<Incident> findByCreatedBy(int userId);
}