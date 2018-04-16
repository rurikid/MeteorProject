import { Projects } from '/imports/api/projects/projects.js';
import { Users } from '/imports/api/users/users.js';
import { Timesheets } from '/imports/api/timesheets/timesheets.js';
import { Meteor } from 'meteor/meteor';
import './newTimesheet.html';

Template.newTimesheet.onCreated(function () {
  Meteor.subscribe('projects.all');
  Meteor.subscribe('users.all');
  Meteor.subscribe('timesheets.all');
});

Template.newTimesheet.helpers({
	// returns all projects
	projects() {
		return Projects.find({});
	},
	// determines if a user belongs to a project
	isMember: function(projectID) {
		// search Projects for ProjectID
		var result = Projects.findOne({"_id": projectID});

		// guarding
		var supervisor = result && result.supervisor;

		return (Meteor.user().profile.position === 'Administrator' || Meteor.user()._id === result.supervisor);
	},
});

Template.newTimesheet.events({
	'click #back': function(event){
		// Prevent default browser behavior
		event.preventDefault();

		// Clear form
		date.value = '';
		project.value = '';
		startTime.value = '';
		endTime.value = '';

		// close modal
		Modal.hide('newTimesheet');
	},

	'click #clear': function(event){
		// Prevent default browser behavior
		event.preventDefault();

		// Clear form
		date.value = '';
		project.value = '';
		startTime.value = '';
		endTime.value = '';
	},

	'click #submit': function(event){
		// Prevent default browser behavior
		event.preventDefault();

		// var timesheetID = Session.get('selectedTimesheetID');

		var timesheet = {
			date: $('#date').val(),
			employee: Meteor.user()._id,
		}

		// creates a new timesheet if one is not made already
		Meteor.call('insertTimesheet', timesheet, (error) => {
			if (error) {
				alert(error.error);
			}
		});

		var newTimesheet = Timesheets.findOne({'date': timesheet.date, 'employee': timesheet.employee});

		var timechunk = {
			timesheet: newTimesheet._id,
			project: $('#project').val(),
			startTime: $('#startTime').val(),
			endTime: $('#endTime').val(),
		}

		Meteor.call('insertTimechunk', timechunk, (error) => {
			if (error) {
				alert(error.error);
			} else {
				// success alert
				return swal({
    			title: "Success",
    			text: "New Timesheet Added",
    			button: {
    				text: "Close",
    			},
    			icon: "success"
    		});
			}
		});

		// Clear form
		date.value = '';
		project.value = '';
		startTime.value = '';
		endTime.value = '';

		// dismiss modal
	  Modal.hide('newTimesheet');
	},
})