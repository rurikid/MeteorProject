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

Template.TeamTableHeader.events({

    'click .editProject'(event) {
        // Prevent default browser behavior
        event.preventDefault();
  
        var projectId = Session.get("projectId");
        // // get value from form element
        // const ids = document.getElementsByName('projectID');
        // var id;
        // for (i = 0; i < ids.length; i++) {
        //     if (ids[i].checked){
        //         id = ids[i].value;
        //     }
        // }
  
      Meteor.call('editProjectModal', projectId);
    }

    //------------------------TO SORT-------------------------NOT WORKING--------
    // 'click .th-sortable': function(e, t) {
	// 	e.preventDefault();
	// 	var oldSortBy = pageSession.get("TeamTeamUsersTeamUsersDataViewSortBy");
	// 	var newSortBy = $(e.target).attr("data-sort");

	// 	pageSession.set("TeamTeamUsersTeamUsersDataViewSortBy", newSortBy);
	// 	if(oldSortBy == newSortBy) {
	// 		var sortAscending = pageSession.get("TeamTeamUsersTeamUsersDataViewSortAscending") || false;
	// 		pageSession.set("TeamTeamUsersTeamUsersDataViewSortAscending", !sortAscending);
	// 	} else {
	// 		pageSession.set("TeamTeamUsersTeamUsersDataViewSortAscending", true);
	// 	}
	// }
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
    
    	// evaluates for supervisors
	isSupervisor() {
		return (Meteor.user().profile.position === 'Administrator' || Meteor.user().profile.position === 'Supervisor');
    },
    
});