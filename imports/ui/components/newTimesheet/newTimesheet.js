import { Projects } from '/imports/api/projects/projects.js';
import { Users } from '/imports/api/users/users.js';
import { Timesheets } from '/imports/api/timesheets/timesheets.js';
import { Timechunks } from '/imports/api/timechunks/timechunks.js';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
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
		     (timechunk.startTime > moment().format("HH:mm") ||
		      timechunk.endTime > moment().format("HH:mm"))));
}

// evaluates if a date is within the allowed timeframe
function inLastTwoWeeks(date) {
	return (moment(date).week() < moment(moment().subtract(1, 'week')).week());
}

// enforces form completeness and proper standards
function validateTimechunk(timechunk, timesheet) {

	// evaluates for void fields
	if (timechunk.startTime === '' ||
			timechunk.endTime === '' ||
			timechunk.project === '' ||
			timesheet.date == '' ||
			timesheet.employee == '') {
		return "Please complete all fields!";
	}

	// evaluates for proper time format
	if (checkform(timechunk) !== true) {
		return checkform(timechunk);
	}

	// evaluates for future start times
	if (isFuture(timechunk, timesheet.date)) {
	 	return "Time must not be in the future!";
	}

	// evaluates for dates outside of range
	if (inLastTwoWeeks(timesheet.date)) {
		return "Date must not precede last week!"
	}

	// evaluates for inverted start/end times
	if (timechunk.endTime <= timechunk.startTime && timechunk.endTime !== '00:00') {
		return "Start time must begin before end time!";
	}

	// evaluates for conflicting timechunks
	var timesheet = Timesheets.findOne({"date": timesheet.date, "employee": timesheet.employee});
	
	var timesheetID = timesheet && timesheet._id;

	var timechunks = Timechunks.find({"timesheet:": timesheetID});

	for (var i = 0; i < timechunks.length; i++) {
		if ((timechunk.startTime > timechunks[i].startTime &&
			   timechunk.startTime < timechunks[i].endTime) ||
				(timechunk.endTime < timechunks[i].endTime &&
				 timechunk.endTime > timechunks[i].startTime) ||
				(timechunk.startTime === timechunks[i].startTime ||
				 timechunk.endTime === timechunks[i].endTime)) {

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
	timechunk: function() {
		var timechunkID = Session.get('selectedTimechunkID');

		if (typeof timechunkID !== "undefined") {
			var timechunk = Timechunks.findOne(timechunkID);
			return timechunk;
		} else {
			return {
				date:'', 
				project:'', 
				startTime:'',
				endTime:'',
			}
		}

	},
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
	// returns appropriate text for edit/new
	isNew: function() {
		var timechunkID = Session.get('selectedTimechunkID');

		if (timechunkID === null) {
			return "Add New Timesheet";
		} else {
			return "Update Timesheet";
		}
	},
	// returns date for appropriate timesheet
	getDate: function(timesheetID) {
		var timesheet = Timesheets.findOne({"_id": timesheetID});

		var date = timesheet && timesheet.date;

		return date;
	},
	// returns selected for appropriate project
	isEdit: function(projectID) {
		var timechunkID = Session.get('selectedTimechunkID');

		if (timechunkID !== null) {
			var timechunk = Timechunks.findOne(timechunkID);

			if (timechunk.project === projectID) {
				return "selected";
			} else {
				return "";
			}
		}
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

		var timechunkID = Session.get('selectedTimechunkID');

		// build timesheet
		var timesheet = {
			employee: Meteor.user()._id,
			date: $('#date').val(),
		}

		// build timechunk
		var timechunk = {
			project: $('#project').val(),
			startTime: $('#startTime').val(),
			endTime: $('#endTime').val(),
		}

		// validate timechunk 
		checkTimechunk = validateTimechunk(timechunk, timesheet, timesheet);
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

		// if not in edit mode
		if (!timechunkID) {
			// if new timesheet doesn't exist
			if (Timesheets.find({'date': timesheet.date, 'employee': timesheet.employee}, {limit: 1}).count() < 1) {
				Meteor.call('insertTimesheet', timesheet, timechunk, (error) => {
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
				// if new timesheet exists
				Meteor.call('insertTimechunk', timechunk, timesheet, (error) => {
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
		} else {
			// if new timesheet doesn't exist
			if (Timesheets.find({'date': timesheet.date, 'employee': timesheet.employee}, {limit: 1}).count() < 1) {
				Meteor.call('insertTimesheet', timesheet, timechunk, (error) => {
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
				_.extend(timechunk, {id: timechunkID});
				Meteor.call('editTimechunk', timechunk, (error) => {
					if (error) {
						alert(error.error);
					} else {

						// success alert
						return swal({
							title: "Success",
							text: "Timesheet Updated",
							button: {
								text: "Close",
							},
							icon: "success"
						});
					}
				});
			}
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