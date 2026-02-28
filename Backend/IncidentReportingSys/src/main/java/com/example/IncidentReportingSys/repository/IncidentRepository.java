package com.example.IncidentReportingSys.repository;

import com.example.IncidentReportingSys.model.Incident;
import com.example.IncidentReportingSys.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Integer> {

    // Find incidents by status
    List<Incident> findByStatus(Status status);

    // Find incidents assigned to a specific user (by userId)
    List<Incident> findByAssignedTo(int userId);

    // Find incidents created by a specific user (by userId)
    List<Incident> findByCreatedBy(int userId);
}