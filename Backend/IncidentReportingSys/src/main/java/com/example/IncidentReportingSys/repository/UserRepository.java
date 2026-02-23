package com.example.IncidentReportingSys.repository;

import com.example.IncidentReportingSys.model.User;
import com.example.IncidentReportingSys.model.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {

    // Optional: find users by role
    List<User> findByRole(UserType role);

    // Optional: find user by name
    User findByName(String name);
}