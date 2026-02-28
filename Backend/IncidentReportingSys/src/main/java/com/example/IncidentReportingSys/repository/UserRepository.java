package com.example.IncidentReportingSys.repository;

import com.example.IncidentReportingSys.model.User;
import com.example.IncidentReportingSys.model.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {

    // Find users by role (enum)
    List<User> findByRole(UserType role);

    // Find user by username
    User findByUsername(String username);

    User findByEmail(String email);
}