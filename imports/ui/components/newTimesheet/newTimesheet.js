import { Projects } from '/imports/api/projects/projects.js';
import { Users } from '/imports/api/users/users.js';
import { Timesheets } from '/imports/api/timesheets/timesheets.js';
import { Meteor } from 'meteor/meteor';
import './newTimesheet.html';

// evaluates for proper time format
function checkform(timechunk){
	// regex for valid times
	re = /([0-1][0-9]|[2][0-3])[:]([0][0]|[1][5]|[3][0]|[4][5])/;

	// tests
	if (!re.test(timechunk.startTime)) {
		return "Invalid start time! \n 24 Hr Clock Only";
	}
	if (!re.test(timechunk.endTime)) {
		return "Invalid end time! \n 24 Hr Clock Only";
	}
	return true;
}

function isFuture(timechunk, date) {
	return (moment(date).isAfter(moment().format("YYYY-MM-DD")) ||
		     (moment(date).isSame(moment().format("YYYY-MM-DD")) && 
		      timechunk.startTime > moment().format("HH:mm")) ||
		      timechunk.endTime > moment().format("HH:mm"));
}

// evaluates if a date is within the allowed timeframe
function inLastTwoWeeks(date) {
	return (moment(date).week() < moment(moment().subtract(1, 'week')).week());
}

// enforces form completeness and proper standards
function validateTimechunk(timechunk, date, employee) {

	// evaluates for void fields
	if (timechunk.startTime === '' ||
			timechunk.endTime === '' ||
			timechunk.project === '' ||
			date == '' ||
			employee == '') {
		return "Please complete all fields!";
	}

	// evaluates for proper time format
	if (checkform(timechunk) !== true) {
		return checkform(timechunk);
	}

	// evaluates for future start times
	if (isFuture(timechunk, date)) {
	 	return "Time must not be in the future!";
	}

	// evaluates for dates outside of range
	if (inLastTwoWeeks(date)) {
		return "Date must not precede last week!"
	}

	// evaluates for inverted start/end times
	if (timechunk.endTime <= timechunk.startTime && timechunk.endTime !== '00:00') {
		return "Start time must begin before end time!";
	}

	// evaluates for conflicting timechunks
	var timesheet = Timesheets.findOne({"date": date, "employee": employee});
	for (var i = 0; i < timesheet.timechunks.length; i++) {
		if ((timechunk.startTime > timesheet.timechunks[i].startTime &&
			   timechunk.startTime < timesheet.timechunks[i].endTime) ||
				(timechunk.endTime < timesheet.timechunks[i].endTime &&
				 timechunk.endTime > timesheet.timechunks[i].startTime) ||
				(timechunk.startTime === timesheet.timechunks[i].startTime ||
				 timechunk.endTime === timesheet.timechunks[i].endTime)) {

			return "Your times are conflicting with other timeslots!";
		}
		
	}

	return true;
}

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

		var employee = Meteor.user()._id;
		var date = $('#date').val();

		// build timechunk
		var timechunk = {
			project: $('#project').val(),
			startTime: $('#startTime').val(),
			endTime: $('#endTime').val(),
		}

		// begin validation
		checkTimechunk = validateTimechunk(timechunk, date, employee);
		if (checkTimechunk !== true) {
      // return bad timesheet
      return swal({
       	title: "Error",
        text: checkTimechunk,
		   	button: {
		   		text: "Close",
		   	},
         icon: "error"
      });
		}

		if (Timesheets.find({'date': date, 'employee': employee}, {limit: 1}).count() < 1) {
			var timesheet = {
				date: date,
				employee: employee,
				timechunk: timechunk,
			}
			Meteor.call('insertTimesheet', timesheet, (error) => {
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
		} else {
			Meteor.call('insertTimechunk', timechunk, date, employee, (error) => {
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
		}

		// Clear form
		date.value = '';
		project.value = '';
		startTime.value = '';
		endTime.value = '';

		// dismiss modal
	  Modal.hide('newTimesheet');
	},
})