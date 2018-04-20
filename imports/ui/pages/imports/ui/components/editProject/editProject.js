import { Projects } from '/imports/api/projects/projects.js';
import { Users } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import './editProject.html';

Template.editProject.onCreated(function () {
  Meteor.subscribe('projects.all');
  Meteor.subscribe('users.all');
});

Template.editProject.helpers({
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

Template.editProject.events({
  'click #back': function(event){
    event.preventDefault();
		$('#editProjectModal').modal('hide');
  },

  'click #clear': function(event){
    event.preventDefault();
		// Clear form
		projectName.value = '';
		supervisor.value = '';
		client.value = '';
		budget.value = '';
  },

	'click #submit'(event){
		// Prevent default browser form submit
		event.preventDefault();

		// Get value from form element
    var project = {
      name: $('#projectName').val(),
      supervisor: $('#supervisor').val(),
      client: $('#client').val(),
      budget: $('#budget').val()
    }

		Meteor.call('projectEdit', project, (error) => {
			if (error) {
				alert(error.error);
			} else {
				// Clear form
				projectName.value = '';
				supervisor.value = '';
				client.value = '';
				budget.value = '';

				// dismiss modal
				$('#editProjectModal').modal('hide');

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