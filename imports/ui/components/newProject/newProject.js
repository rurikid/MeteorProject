import { Projects } from '/imports/api/projects/projects.js';
import { Users } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import './newProject.html';

Template.newProject.onCreated(function () {
  Meteor.subscribe('projects.all');
  Meteor.subscribe('users.all');
});

Template.newProject.helpers({
	// returns all projects
	projects() {
		return Projects.find({});
	},
	// returns all users
	users() {
		return Meteor.users.find({});
	},
	// evaluates for supervisors
	isSupervisor: function(position) {
		return ((position === 'Supervisor') || (position === 'Administrator'));
	},
	// finds and retrieves supervisor name
	getSupervisor: function(supervisor) {
		// search for supervisorID
		var result = Meteor.users.findOne({"_id": supervisor});

		// known as guarding (are we finding anything in the query)
		var firstName = result && result.profile && result.profile.firstName;
		var lastName = result && result.profile && result.profile.lastName;

		return (firstName + " " + lastName);
	},
});

Template.newProject.events({
  'click .back': function(event){
    event.preventDefault();
    FlowRouter.go('/projects');
  },

	'submit .newProject'(event) {
		// Prevent default browser form submit
		event.preventDefault();

		// Get value from form element
		const target = event.target;
		const name = target.name;
		const supervisor = target.supervisor;
		const client = target.client;
		const budget = target.budget;

		Meteor.call('projects.insert', name.value, supervisor.value, client.value, budget.value, (error) => {
			if (error) {
				alert(error.error);
			} else {
				// Clear form
				name.value = '';
				supervisor.value = '';
				client.value = '';
				budget.value = '';

				// success alert
				return swal({
    			title: "Success",
    			text: "New Project Added",
    			button: {
    				text: "Close",
    			},
    			icon: "success"
    		});
			}
		});
	},
});