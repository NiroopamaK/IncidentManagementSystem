package com.example.IncidentReportingSys.controller;

import com.example.IncidentReportingSys.model.Comment;
import com.example.IncidentReportingSys.repository.CommentRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@CrossOrigin(origins = "http://localhost:4200")
public class CommentController {

    private final CommentRepository commentRepository;

    public CommentController(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('REPORTER', 'REVIEWER', 'ADMIN')")
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('REPORTER', 'REVIEWER', 'ADMIN')")
    public Comment getCommentById(@PathVariable int id) {
        return commentRepository.findById(id).orElse(null);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('REVIEWER')")
    public Comment createComment(@RequestBody Comment comment) {
        return commentRepository.save(comment);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('REVIEWER')")
    public void deleteComment(@PathVariable int id) {
        commentRepository.deleteById(id);
    }

    @GetMapping("/incident/{incidentId}")
    @PreAuthorize("hasAnyAuthority('REPORTER', 'REVIEWER', 'ADMIN')")
    public List<Comment> getCommentsByIncident(@PathVariable int incidentId) {
        return commentRepository.findByIncidentId(incidentId);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyAuthority('REPORTER', 'REVIEWER', 'ADMIN')")
    public List<Comment> getCommentsByUser(@PathVariable int userId) {
        return commentRepository.findByUserId(userId);
    }
}