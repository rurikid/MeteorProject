import { Projects } from '/imports/api/projects/projects.js';
import { Users } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import '/imports/api/helpers/modal.js';
import './projects.html';

Template.projects.onCreated(function () {
  Meteor.subscribe('projects.all');
	Meteor.subscribe('users.all');
	
});

Template.projects.helpers({
	// returns all projects
	projects() {
		return Projects.find({});
	},

	// returns all users
	users() {
		return Meteor.users.find({});
	},

	// evaluates for admins
	isAdmin() {
		return Meteor.user().profile.position === 'Administrator';
	},

	// evaluates for supervisors
	isSupervisor() {
		return (Meteor.user().profile.position === 'Administrator' || Meteor.user().profile.position === 'Supervisor');
	},
  
	// finds and retrieves supervisor name
	getProjectSupervisor: function(supervisor) {
		// search for supervisorID
		var result = Meteor.users.findOne({"_id": supervisor});

		// known as guarding (are we finding anything in the query)
		var firstName = result && result.profile && result.profile.firstName;
		var lastName = result && result.profile && result.profile.lastName;

		return (firstName + " " + lastName);
	},

	// determines if a user belongs to a project
	isMember: function(projectID) {
		// search Projects for ProjectID
		var result = Projects.findOne({"_id": projectID});

		// guarding
		var supervisor = result && result.supervisor;

		return (Meteor.user().profile.position === 'Administrator' || Meteor.user()._id === result.supervisor);
	},

  	// finds and retrieves employee name
	getProjectEmployee: function(employee) {
		var result = Meteor.users.findOne({"_id": employee});

		// known as guarding (are we finding anything in the query)
		var firstName = result && result.profile && result.profile.firstName;
		var lastName = result && result.profile && result.profile.lastName;

		return (firstName + " " + lastName);
	},
	
	//returns whether current user is an employee, supervisor, or not in project
	getUserRole: function(supervisor, employees) {
		//if user is in project check if he's the supervisor of project
		var supervisorResult = Meteor.users.findOne({"_id": supervisor});
		var supervisorName = supervisorResult.profile.firstName + " " + supervisorResult.profile.lastName;

		var loggedUserResult = Meteor.user().profile;
		var loggedUserName = loggedUserResult.firstName + " " +loggedUserResult.lastName; 
		if (supervisorName == loggedUserName){
				return "Supervisor/Employee";
		}

		//if user is in project check if he's just an employee in project
		for(index = 0; index < employees.length; index++){

			var employeeResult = Meteor.users.findOne({"_id": employees[index]});
			var employeeName = employeeResult.profile.firstName + " " + employeeResult.profile.lastName;
			
			
			if (employeeName == loggedUserName) {
				return "Employee";
			}
			else {
				return "[Not on project]";
			}
		}
	},
});

Template.projects.events({
  'click .deleteProject'(event) {
    // Prevent default browser behavior
    event.preventDefault();

    // Get value from form element
    const ids = document.getElementsByName('projectID');
    var id;
    for (i = 0; i < ids.length; i++) {
      if (ids[i].checked){
        id = ids[i].value; 
      }
    }

    Meteor.call('deleteProject', id, (error) => {
      if (error) {
        alert(error.error);
      } else {

        // success alert
        return swal({
          title: "Removed!",
          text: "Project Removed",
          button: {
            text: "Close",
          },
          icon: "success"
        });
      }
    });
  },

  'click .newProject'(event) {
  	// Prevent default browser behavior
  	event.preventDefault();
    Meteor.call('editProjectModal', null);
  },

  'click .editProject'(event) {
  	// Prevent default browser behavior
  	event.preventDefault();

  	// get value from form element
  	const ids = document.getElementsByName('projectID');
  	var id;
  	for (i = 0; i < ids.length; i++) {
  		if (ids[i].checked){
  			id = ids[i].value;
  		}
  	}

    Meteor.call('editProjectModal', id);
  },
});
