package com.example.IncidentReportingSys.controller;

import com.example.IncidentReportingSys.model.Incident;
import com.example.IncidentReportingSys.model.Status;
import com.example.IncidentReportingSys.repository.IncidentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/incidents")
@CrossOrigin(origins = "http://localhost:4200")
public class IncidentController {

    private final IncidentRepository incidentRepository;

    public IncidentController(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    // Get all incidents
    @GetMapping
    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    // Get incident by ID
    @GetMapping("/{id}")
    public Incident getIncidentById(@PathVariable int id) {
        return incidentRepository.findById(id).orElse(null);
    }

    // Create new incident
    @PostMapping
    public Incident createIncident(@RequestBody Incident incident) {
        return incidentRepository.save(incident);
    }

    // Update existing incident
    @PutMapping("/{id}")
    public Incident updateIncident(@PathVariable int id, @RequestBody Incident incidentDetails) {
        Incident incident = incidentRepository.findById(id).orElse(null);
        if (incident == null)
            return null;

        incident.setTitle(incidentDetails.getTitle());
        incident.setDescription(incidentDetails.getDescription());
        incident.setStatus(incidentDetails.getStatus());
        incident.setCreatedBy(incidentDetails.getCreatedBy());
        incident.setAssignedTo(incidentDetails.getAssignedTo());
        return incidentRepository.save(incident);
    }

    // Delete incident
    @DeleteMapping("/{id}")
    public void deleteIncident(@PathVariable int id) {
        incidentRepository.deleteById(id);
    }

    // Optional: get incidents by status
    @GetMapping("/status/{status}")
    public List<Incident> getIncidentsByStatus(@PathVariable Status status) {
        return incidentRepository.findByStatus(status);
    }

    // Optional: get incidents created by user
    @GetMapping("/createdBy/{userId}")
    public List<Incident> getIncidentsByCreator(@PathVariable int userId) {
        return incidentRepository.findByCreatedBy(userId);
    }

    // Optional: get incidents assigned to user
    @GetMapping("/assignedTo/{userId}")
    public List<Incident> getIncidentsByAssignee(@PathVariable int userId) {
        return incidentRepository.findByAssignedTo(userId);
    }
}