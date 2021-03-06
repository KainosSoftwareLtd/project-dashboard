'use strict';
var _ = require('underscore');
var Person = require('./person');
var ResourceLink = require('./resourceLink');
var HealthRecord = require('./healthRecord');
var ProjectMetadata = require('./projectMetadata');

module.exports = class Project {
    constructor(name, description) {
        this.name = name;
        this.description = description;
        this.ourTeam = [];
        this.clientTeam = [];
        this.healthStatusHistory = {};
        this.health = {};
        this.resources = [];
        this.phaseHistory = {};
		this.projectMetadata = {};

        // setting defaults - this project was designed not to work without them...
        this.facing = "user";
        this.priority = "Low";
        this.location = "Unknown";
        this.isFinished = false;
        this.setPhase('pipeline');
        this.health.overall = new HealthRecord(
            "overall",
            "unknown",
            {name: "Added Automatically", email: ""},
            "Overall project health has not yet been set.");
		this.sector = "";
		this.department = "";
		this.agency = "";	
		this.projectMetadata = new ProjectMetadata("");
    }

    setId(str) { this.id = str; }
    setName(str) { this.name = str; }
    setDescription(str) { this.description = str; }
    setLocation(str) { this.location = str; }
    setDepartment(str) { this.department = str; }
    setAgency(str) { this.agency = str; }
    setIsFinished(bool) { this.isFinished = bool; }
    setCustomer(str) { this.customer = str; }
    setHealth(type, status, user, comment, linkTitle, link) {
        var resource = null;
        if(linkTitle && link) {
            resource = new ResourceLink(linkTitle, link);
        }

        var h = new HealthRecord(type, status, user, comment, resource);

        if(status && !this.health[type] || status && status !== this.health[type].status) {
            this.addHealthHistory(h);
        }

        if(status && type) {
            this.health[type] = h;
        }
    }

    setPriority(str) { this.priority = str; }
    setOurTeam(ourTeam) { this.ourTeam = ourTeam; }
    setClientTeam(clientTeam) { this.clientTeam = clientTeam; }
    setPhase(phase) { this.phase = phase; }
    setResources(resources) { this.resources = resources; }
    setHealthStatusHistory(array) { this.healthStatusHistory = array; }

	setProjectMetadata(projectMetadata) {
        this.projectMetadata = new ProjectMetadata(projectMetadata.tags); 
    }
	
    setPhaseHistoryEntry(phase, label, month, year) {
        this.phaseHistory[phase] = this.phaseHistory[phase] || {};
        this.phaseHistory[phase][label] = {
            year: year,
            month: month
        };
        this.setPhase(this.getLatestPhaseName());
    }

	setSector(str) { this.sector = str; }
    setDepartment(str) { this.department = str; }
    setAgency(str) { this.agency = str; }
	
    getLatestPhaseName() {
        return this.phaseHistory['live'] ? 'live' :
            this.phaseHistory['beta'] ? 'beta' :
            this.phaseHistory['alpha'] ? 'alpha' :
            this.phaseHistory['discovery'] ? 'discovery' :
            this.phaseHistory['pipeline'] ? 'pipeline' : 'pipeline';
    }

    getOverallHealthRequirement() {
        var healthRequirement = "The current assurance needs of this project are not known.";
        switch (this.health.overall.status) {
            case "risk":
                healthRequirement = "This project needs significant additional senior support.";
                break;
            case "fair":
                healthRequirement = "This project needs some additional senior support.";
                break;
            case "good":
                healthRequirement = "This project does not require any additional senior support.";
                break;
            case "unknown":
                healthRequirement = "The current assurance needs of this project are not known.";
                break;                             
            default:
                break;
        }
        return healthRequirement;
    }

    addToOurTeam(Person) {
        this.ourTeam.push(Person);
    }

    addToClientTeam(Person) {
        this.clientTeam.push(Person);
    }

    addResource(ResourceLink) {
        this.resources.push(ResourceLink);
    }

    addHealthHistory(healthHistory) {
        if(!this.healthStatusHistory[healthHistory.type]) {
            this.healthStatusHistory[healthHistory.type] = [];
        }

        this.healthStatusHistory[healthHistory.type].push(healthHistory);
    }

    removeFromOurTeam(id) {
        this.ourTeam = _.reject(this.ourTeam, function(person) {
            return person.id === id;
        });
    }

    removeFromClientTeam(id) {
        this.clientTeam = _.reject(this.clientTeam, function(person) {
            return person.id === id;
        });
    }

    removeFromResources(id) {
        this.resources = _.reject(this.resources, function(resource) {
            return resource.id === id;
        });
    }

    removeFromPhaseHistory(phase, label) {
        delete this.phaseHistory[phase][label];
        // if the phase is empty, remove it
        if (Object.getOwnPropertyNames(this.phaseHistory[phase]).length === 0) {
            delete this.phaseHistory[phase];
        }
        this.setPhase(this.getLatestPhaseName());
    }

    static fromJson(data) {
        var p = new Project();
        Object.assign(p, data);

        if (data && data.ourTeam) {
            p.setOurTeam([]);
            data.ourTeam.forEach(function(item) {
                p.addToOurTeam(Person.fromJson(item));
            });
        }

        if (data && data.clientTeam) {
            p.setClientTeam([]);
            data.clientTeam.forEach(function(item) {
                p.addToClientTeam(Person.fromJson(item));
            });
        }

        if (data && data.resources) {
            p.setResources([]);
            data.resources.forEach(function(item) {
                p.addResource(ResourceLink.fromJson(item));
            });
        }

        if (data && data.health) {
            p.health = _.mapObject(data.health, function(val, key) {
                return HealthRecord.fromJson(val);
            });
        }

        if (data && data.healthStatusHistory) {
            p.healthStatusHistory = _.mapObject(data.healthStatusHistory, function(values, key) {
                return values.map(function(value) {
                    return HealthRecord.fromJson(value);
                });
            });
        }
		
		if (data && data.projectMetadata) {
			p.projectMetadata = ProjectMetadata.fromJson(data.projectMetadata);
			p.projectMetadata.tags = data.projectMetadata.tags;
        }
	
        p.setIsFinished(p.isFinished == true);
		
        return p;
    }
}
