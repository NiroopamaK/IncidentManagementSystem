package com.example.IncidentReportingSys.controller;

import com.example.IncidentReportingSys.model.Comment;
import com.example.IncidentReportingSys.repository.CommentRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
// @CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Comments", description = "Endpoints for managing comments")
public class CommentController {

    private final CommentRepository commentRepository;

    public CommentController(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Operation(summary = "Get all comments")
    @GetMapping
    @PreAuthorize("hasAnyAuthority('REPORTER', 'REVIEWER', 'ADMIN')")
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    @Operation(summary = "Get comment by ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('REPORTER', 'REVIEWER', 'ADMIN')")
    public Comment getCommentById(@PathVariable int id) {
        return commentRepository.findById(id).orElse(null);
    }

    @Operation(summary = "Create a comment (Reviewer only)")
    @PostMapping
    @PreAuthorize("hasAnyAuthority('REVIEWER')")
    public Comment createComment(@RequestBody Comment comment) {
        return commentRepository.save(comment);
    }

    @Operation(summary = "Delete comment by ID (Reviewer only)")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('REVIEWER')")
    public void deleteComment(@PathVariable int id) {
        commentRepository.deleteById(id);
    }

    @Operation(summary = "Get comments by incident")
    @GetMapping("/incident/{incidentId}")
    @PreAuthorize("hasAnyAuthority('REPORTER', 'REVIEWER', 'ADMIN')")
    public List<Comment> getCommentsByIncident(@PathVariable int incidentId) {
        return commentRepository.findByIncidentId(incidentId);
    }

    @Operation(summary = "Get comments by user")
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyAuthority('REPORTER', 'REVIEWER', 'ADMIN')")
    public List<Comment> getCommentsByUser(@PathVariable int userId) {
        return commentRepository.findByUserId(userId);
    }
}