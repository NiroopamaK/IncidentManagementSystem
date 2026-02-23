package com.example.IncidentReportingSys.controller;

import com.example.IncidentReportingSys.model.Comment;
import com.example.IncidentReportingSys.repository.CommentRepository;
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

    // Get all comments
    @GetMapping
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    // Get comment by ID
    @GetMapping("/{id}")
    public Comment getCommentById(@PathVariable int id) {
        return commentRepository.findById(id).orElse(null);
    }

    // Create new comment
    @PostMapping
    public Comment createComment(@RequestBody Comment comment) {
        return commentRepository.save(comment);
    }

    // Update existing comment
    @PutMapping("/{id}")
    public Comment updateComment(@PathVariable int id, @RequestBody Comment commentDetails) {
        Comment comment = commentRepository.findById(id).orElse(null);
        if (comment == null)
            return null;

        comment.setIncidentId(commentDetails.getIncidentId());
        comment.setUserId(commentDetails.getUserId());
        comment.setMessage(commentDetails.getMessage());
        return commentRepository.save(comment);
    }

    // Delete comment
    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable int id) {
        commentRepository.deleteById(id);
    }

    // Optional: get comments by incident
    @GetMapping("/incident/{incidentId}")
    public List<Comment> getCommentsByIncident(@PathVariable int incidentId) {
        return commentRepository.findByIncidentId(incidentId);
    }

    // Optional: get comments by user
    @GetMapping("/user/{userId}")
    public List<Comment> getCommentsByUser(@PathVariable int userId) {
        return commentRepository.findByUserId(userId);
    }
}