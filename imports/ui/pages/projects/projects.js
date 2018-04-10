import { Projects } from '/imports/api/projects/projects.js';
import { Users } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
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
	// determins if a user belongs to a project
	isMember: function(projectID) {
		// search Projects for ProjectID
		var result = Projects.findOne({"_id": projectID});

		// guarding
		var supervisor = result && result.supervisor;

		return (Meteor.user().profile.position === 'Administrator' || Meteor.user()._id === result.supervisor);
	}
});

Template.projects.events({
  'click .newProject': function(event){
    event.preventDefault();
    FlowRouter.go('/newProject');
  },
});