import { Users } from '../../../api/users/users.js';
import { Projects } from '../../../api/projects/projects.js'

import './team.html'

// TODO
//   Integrate with Database
//   Select Users from Project Logic
//var pageSession = new ReactiveDict();

Template.team.events({
    "change #project-select": function(event, Template) {
        console.log("Variable Changed");
        var projectId = $(event.currentTarget).val();
        Session.set("showMembers", true);
        Session.set("projectId", projectId);
        FlowRouter.go('/team');
        Projects.find({});
    }
});

Template.team.helpers({
    projects() {
         //un-comment for when we have supervisor login in.
        //return Projects.find({"supervisor": Meteor.userId()});
        console.log("aj;lkadakdf a");
		return Projects.find({});
    },
    
    "showMembers": function() {
        
		return Session.get("showMembers");
	},
});

Template.TeamTableHeader.helpers({
    tableItems() {
        var projectId = Session.get("projectId");
        var project = Projects.findOne({"_id": projectId});
        var employees = project.employees;
        console.log(employees);
        
        var users = Meteor.users.find({"_id": {"$in": employees}});
        console.log(users);
        //return Meteor.users.find({});
        return users;
    },

    "showMembers": function() {
        console.log("Inside Team Table Members");
		return Session.get("showMembers");
	},
});