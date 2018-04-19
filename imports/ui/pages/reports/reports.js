import { Users } from '/imports/api/users/users.js';
import { Timesheets } from '/imports/api/timesheets/timesheets.js';
import { Timechunks } from '/imports/api/timechunks/timechunks.js';
import { Meteor } from 'meteor/meteor';
import '/imports/api/helpers/modal.js';
import { Projects } from '../../../api/projects/projects.js'

import './reports.html';


Template.reportsForm.onDestroyed( function () {
    
    console.log("Calling on Destroyed");
    Session.set("isDateRange", false);
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
    },

    "change #employee-select": function(event, Template) {
        console.log("Variable Changed");
        var employeeId = $(event.currentTarget).val();
        Session.set("employeeId", employeeId);
        console.log("Employee Selected", reportType);
    }

});

Template.reportsForm.helpers({
    projects() {
         //un-comment for when we have supervisor login in.
        //return Projects.find({"supervisor": Meteor.userId()});
        console.log("Project helper");
		return Projects.find({});
    },

    employees() {
        var projectId = Session.get("projectId");
        var project = Projects.findOne({"_id": projectId});
        var employees = project.employees;        
        var users = Meteor.users.find({"_id": {"$in": employees}});
        return users;
    },
    
    "isDateRange": function() {
        console.log("printing date range", Session.get("isDateRange"));
		return Session.get("isDateRange");
	},
});

