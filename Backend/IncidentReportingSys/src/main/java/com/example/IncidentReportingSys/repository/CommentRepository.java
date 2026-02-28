package com.example.IncidentReportingSys.repository;

import com.example.IncidentReportingSys.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

    // Find all comments for a specific incident
    List<Comment> findByIncidentId(int incidentId);

    // Find all comments made by a specific user
    List<Comment> findByUserId(int userId);
}