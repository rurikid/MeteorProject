import { Projects } from '/imports/api/projects/projects.js';
import { Users } from '/imports/api/users/users.js';
import { Timesheets } from '/imports/api/timesheets/timesheets.js';
import { Timechunks } from '/imports/api/timechunks/timechunks.js';
import { Meteor } from 'meteor/meteor';
import '/imports/api/helpers/modal.js';
import './teamTimesheets.html';

Template.teamTimesheets.onCreated(function () {
  Meteor.subscribe('projects.all');
  Meteor.subscribe('users.all');
  Meteor.subscribe('timesheets.all');
  Meteor.subscribe('timechunks.all');
});


// returns total hours in a timechunk
function timechunkHours(startTime, endTime) {
  var start = startTime.split(':');
  var end = endTime.split(':');

  var total = (Number(end[0]) * 60 + Number(end[1])) - (Number(start[0]) * 60 + Number(start[1]));

  return total / 60;
}

Template.teamTimesheets.helpers({
	// returns all projects
	projects() {
		return Projects.find({});
	},
	// returns all timechunks by contributors in daterange
	timechunks(contributorID, projectID) {
		var timesheets = Timesheets.find({'employee': contributorID});
		totalTimechunks = [];

		// add date range logic

		timesheets.forEach(function(timesheet) {
			var timechunks = (Timechunks.find({'timesheet': timesheet._id, 'project': projectID}));
				timechunks.forEach(function(timechunk) {
					totalTimechunks.push(timechunk);
				});
		});

		return totalTimechunks;
	},
	// returns true if supervisor or admin of a project
	isSupervisor(supervisorID) {
		return Meteor.user()._id === supervisorID || Meteor.user().profile.position === "Administrator";
	},
	// returns name of employee
	getName(employeeID) {
		var employee = Meteor.users.findOne({'_id': employeeID});
		firstName = employee && employee.profile && employee.profile.firstName;
		lastName = employee && employee.profile && employee.profile.lastName;

		if (!employeeID) {
			return "Not Assigned";
		}

		return firstName + " " + lastName;
	},
	// returns all employees which contributed towards a project
	projectContributors(projectID) {

		project = Projects.findOne({'_id': projectID});
		contributors = [];

		// add date range logic
		// project member and contributor logic

		project.employees.forEach(function(employee) {
			contributors.push(Meteor.users.findOne({'_id': employee}));
		});

		return contributors;
	},
	// returns timechunk date
	getTimechunkDate(timesheetID) {
		var timesheet = Timesheets.find({'_id': timesheetID});
		var date = timesheet && timesheet.date;
		return (moment(date).format('dddd, MMMM Do YYYY'));
	},
	// returns total hours in a timechunk
	getTimechunkHours(startTime, endTime) {
    return timechunkHours(startTime, endTime);
	},
	// returns total number of hours worked on a project
	getTotalProjectHours(projectID) {
		var timechunks = Timechunks.find({'project': projectID});
		var projectHours = 0;

		// add date range logic

		timechunks.forEach(function(timechunk) {
			projectHours += timechunkHours(timechunk.startTime, timechunk.endTime);
		});

		return projectHours;
	},
})