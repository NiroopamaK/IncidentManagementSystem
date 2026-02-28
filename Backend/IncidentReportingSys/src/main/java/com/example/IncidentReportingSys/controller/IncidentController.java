package com.example.IncidentReportingSys.controller;

import com.example.IncidentReportingSys.model.Incident;
import com.example.IncidentReportingSys.model.Status;
import com.example.IncidentReportingSys.repository.IncidentRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/incidents")
// @CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Incidents", description = "Endpoints for incident management")
public class IncidentController {

    private final IncidentRepository incidentRepository;

    public IncidentController(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    @Operation(summary = "Get all incidents (Admin only)")
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    @Operation(summary = "Get incident by ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('REPORTER', 'REVIEWER', 'ADMIN')")
    public Incident getIncidentById(@PathVariable int id) {
        return incidentRepository.findById(id).orElse(null);
    }

    @Operation(summary = "Create new incident (Reporter only)")
    @PostMapping
    @PreAuthorize("hasAnyAuthority('REPORTER')")
    public Incident createIncident(@RequestBody Incident incident) {
        return incidentRepository.save(incident);
    }

    @Operation(summary = "Update an incident (Reporter/Reviewer)")
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('REPORTER', 'REVIEWER')")
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

    @Operation(summary = "Delete an incident (Reporter only)")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('REPORTER')")
    public void deleteIncident(@PathVariable int id) {
        incidentRepository.deleteById(id);
    }

    @Operation(summary = "Get incidents by status")
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyAuthority('REPORTER', 'REVIEWER', 'ADMIN')")
    public List<Incident> getIncidentsByStatus(@PathVariable Status status) {
        return incidentRepository.findByStatus(status);
    }

    @Operation(summary = "Get incidents by creator")
    @GetMapping("/createdBy/{userId}")
    @PreAuthorize("hasAnyAuthority('REPORTER', 'REVIEWER', 'ADMIN')")
    // @PreAuthorize("hasAnyAuthority('ROLE_REPORTER', 'ROLE_REVIEWER',
    // 'ROLE_ADMIN')")
    public List<Incident> getIncidentsByCreator(@PathVariable int userId) {
        return incidentRepository.findByCreatedBy(userId);
    }

    @Operation(summary = "Get incidents by assignee")
    @GetMapping("/assignedTo/{userId}")
    @PreAuthorize("hasAnyAuthority('REPORTER', 'REVIEWER', 'ADMIN')")
    public List<Incident> getIncidentsByAssignee(@PathVariable int userId) {
        return incidentRepository.findByAssignedTo(userId);
    }

}