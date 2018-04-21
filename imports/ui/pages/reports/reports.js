import { Users } from '/imports/api/users/users.js';
import { Timesheets } from '/imports/api/timesheets/timesheets.js';
import { Timechunks } from '/imports/api/timechunks/timechunks.js';
import { Meteor } from 'meteor/meteor';
import '/imports/api/helpers/modal.js';
import { Projects } from '/imports/api/projects/projects.js'

//import '/imports/api/helpers/modal.js';
import './reports.html';

Template.reportsForm.onCreated( function() {
    Meteor.subscribe('projects.all');
});

Template.reportsForm.onDestroyed( function () {
    
    console.log("Calling on Destroyed");
    Session.set("isDateRange", false);
    Session.set("reportType", null);
    Session.set("fromDate", null);
    Session.set("toDate", null);
    Session.set("projectId", null);
    Session.set("employeeId", null);
    Session.set("projects", null);
});

Template.reportsForm.events({
    "change #report-type-select": function(event, Template) {
        var reportType = $(event.currentTarget).val();
        console.log("Report Type Selected", reportType);
        Session.set("reportType", reportType);
        if(reportType === 'date_range') {
            Session.set("isDateRange", true);
        } else {
            Session.set("isDateRange", false);
        }

        //Reloading the page
        FlowRouter.go('/reports');
    },

    "change #from-date-select": function(event, Template) {
        var fromDate = $(event.currentTarget).val();
        Session.set("fromDate", fromDate);
        console.log("From Date Selected", fromDate);
    },

    "change #to-date-select": function(event, Template) {
        var toDate = $(event.currentTarget).val();
        Session.set("toDate", toDate);
        console.log("To Date Selected", toDate);
    },

    "change #project-select": function(event, Template) {
        var projectId = $(event.currentTarget).val();
        Session.set("projectId", projectId);
        console.log("Project Type Selected", projectId);
        FlowRouter.go('/reports');
    },

    "change #employee-select": function(event, Template) {
        console.log("Variable Changed");
        var employeeId = $(event.currentTarget).val();
        Session.set("employeeId", employeeId);
        console.log("Employee Selected", employeeId);
    },


    'click .generate-report-button': function(event) {
        var reportType = Session.get("reportType");
        var fromDate = Session.get("fromDate");
        var toDate = Session.get("toDate");

        if(reportType == null) {
            return swal({
                title: "Error",
                text: "Please select a time period",
                button: {
                    text: "Close",
                },
                icon: "error"
            });
        } else if (Session.get("projectId") == null) {
            return swal({
                title: "Error",
                text: "Please select a project",
                button: {
                    text: "Close",
                },
                icon: "error"
            });
        } else if (reportType === 'date_range' ) {
            if(fromDate == null) {
                return swal({
                    title: "Error",
                    text: "Please select a from date",
                    button: {
                        text: "Close",
                    },
                    icon: "error"
                });
            } else if(toDate == null) {
                return swal({
                    title: "Error",
                    text: "Please select a to date",
                    button: {
                        text: "Close",
                    },
                    icon: "error"
                });
            } else {
                FlowRouter.go('/generatedReports/' + Session.get("reportType") + "/" + Session.get("projectId") + "/" + fromDate + "/" + toDate);
            }
        } else {        
            FlowRouter.go('/generatedReports/' + Session.get("reportType") + "/" + Session.get("projectId"));
        }
        
        
    },
});

Template.reportsForm.helpers({
    projects() {
        if(Meteor.user().profile.position === 'Administrator') {
            return Projects.find({});
         } else if(Meteor.user().profile.position === 'Supervisor') {
            return Projects.find({"supervisor": Meteor.userId()});
         }
    },

    employees() {
        console.log("Printing Session",Session.get("projectId"));
        if(Session.get("projectId") !== 'undefined') {
            var projectId = Session.get("projectId");
            var project = Projects.findOne({"_id": projectId});
            
            console.log("Inside Employees", project.employees);
            var employees = project.employees;        
            var users = Meteor.users.find({"_id": {"$in": employees}});
            return users;
        }

        return [];
    },
    
    "isDateRange": function() {
        console.log("printing date range", Session.get("isDateRange"));
		return Session.get("isDateRange");
	},
});

