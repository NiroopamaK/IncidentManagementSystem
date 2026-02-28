package com.example.IncidentReportingSys.controller;

import com.example.IncidentReportingSys.model.Incident;
import com.example.IncidentReportingSys.model.Status;
import com.example.IncidentReportingSys.repository.IncidentRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/incidents")
// @CrossOrigin(origins = "http://localhost:4200")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", allowCredentials = "true")
public class IncidentController {

    private final IncidentRepository incidentRepository;

    public IncidentController(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('REPORTER', 'REVIEWER', 'ADMIN')")
    public Incident getIncidentById(@PathVariable int id) {
        return incidentRepository.findById(id).orElse(null);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('REPORTER')")
    public Incident createIncident(@RequestBody Incident incident) {
        return incidentRepository.save(incident);
    }

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

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('REPORTER')")
    public void deleteIncident(@PathVariable int id) {
        incidentRepository.deleteById(id);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyAuthority('REPORTER', 'REVIEWER', 'ADMIN')")
    public List<Incident> getIncidentsByStatus(@PathVariable Status status) {
        return incidentRepository.findByStatus(status);
    }

    @GetMapping("/createdBy/{userId}")
    @PreAuthorize("hasAnyAuthority('REPORTER', 'REVIEWER', 'ADMIN')")
    // @PreAuthorize("hasAnyAuthority('ROLE_REPORTER', 'ROLE_REVIEWER',
    // 'ROLE_ADMIN')")
    public List<Incident> getIncidentsByCreator(@PathVariable int userId) {
        return incidentRepository.findByCreatedBy(userId);
    }

    @GetMapping("/assignedTo/{userId}")
    @PreAuthorize("hasAnyAuthority('REPORTER', 'REVIEWER', 'ADMIN')")
    public List<Incident> getIncidentsByAssignee(@PathVariable int userId) {
        return incidentRepository.findByAssignedTo(userId);
    }

}