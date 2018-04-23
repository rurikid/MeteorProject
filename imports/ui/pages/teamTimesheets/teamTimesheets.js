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
    // var targetRange = Session.get('selectedTargetRange');
    // var timesheets = Timesheets.find({});
    // var projects = new Set([]);
    // var result = [];

    // timesheets.forEach(function(timesheet) {
    // 	if (moment(timesheet.date) >= moment(targetRange.from) &&
    // 		  moment(timesheet.date) <= moment(targetRange.to)) {
    // 		var timechunks = Timechunks.find({'timesheet': timesheet._id});
    // 		timechunks.forEach(function(timechunk) {
    // 			projects.add(timechunk.project);
    // 		});
    // 	}
    // });

    // projects.forEach(function(project) {
    // 	result.push(Projects.findOne({'_id': project}));
    // });

		return Projects.find({});
	},
	// returns all timechunks by contributors in daterange
	timechunks(contributorID, projectID) {
    var targetRange = Session.get('selectedTargetRange');
		var timesheets = Timesheets.find({'employee': contributorID});
		totalTimechunks = [];

		timesheets.forEach(function(timesheet) {
			if (moment(timesheet.date) >= moment(targetRange.from) &&
				  moment(timesheet.date) <= moment(targetRange.to)) {
				var timechunks = (Timechunks.find({'timesheet': timesheet._id, 'project': projectID}));
				timechunks.forEach(function(timechunk) {
					totalTimechunks.push(timechunk);
				});
			}
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
		var firstName = employee && employee.profile && employee.profile.firstName;
		var lastName = employee && employee.profile && employee.profile.lastName;

		if (!employeeID) {
			return "Not Assigned";
		}

		return firstName + " " + lastName;
	},
	// returns all employees which contributed towards a project
	projectContributors(projectID) {
		// if there is a better way to do this please tell me - rurikid

		var project = Projects.findOne({'_id': projectID});
		var timechunks = Timechunks.find({'project': projectID});
		var timesheets = [];
		var contributors = new Set([]);	// set to manage duplicate ids
		var result = [];								// handlebars only takes arrays

		// finds employees no longer assigned to project
		timechunks.forEach(function(timechunk) {
			timesheets.push(Timesheets.findOne({'_id': timechunk.timesheet}));
		});

		// finds all devoted timechunks to project and pushes employee id to set
		timesheets.forEach(function(timesheet) {
			contributors.add(Meteor.users.findOne({'_id': timesheet.employee})._id);
		});

		// finds all current project member ids and pushes to set
		project.employees.forEach(function(employee) {
			contributors.add(Meteor.users.findOne({'_id': employee})._id);
		});

		// finds all contributors and pushes to array
		contributors.forEach(function(contributor) {
			result.push(Meteor.users.findOne({'_id': contributor}));
		});

		return result;
	},
	// returns timechunk date
	getTimechunkDate(timesheetID) {
		var timesheet = Timesheets.findOne({'_id': timesheetID});
		return (moment(timesheet.date).format('dddd, MMMM Do YYYY'));
	},
	// returns total hours in a timechunk
	getTimechunkHours(startTime, endTime) {
    return timechunkHours(startTime, endTime);
	},
	// returns total number of hours worked on a project
	getTotalProjectHours(projectID) {
    var targetRange = Session.get('selectedTargetRange');
		var timesheets = Timesheets.find({});
		var projectHours = 0;

		timesheets.forEach(function(timesheet) {
			if (moment(timesheet.date) >= moment(targetRange.from) &&
				  moment(timesheet.date) <= moment(targetRange.to)) {
				var timechunks = Timechunks.find({'timesheet': timesheet._id, 'project': projectID});
				timechunks.forEach(function(timechunk) {
					projectHours += timechunkHours(timechunk.startTime, timechunk.endTime);
				});
			}
		});

		return projectHours;
	},
	// returns total number of contribution hours by contributor 
	getContributorTotalHours(projectID, contributorID) {
    var targetRange = Session.get('selectedTargetRange');
		var contributorTotalHours = 0;
		var timesheets = Timesheets.find({'employee': contributorID});
		
		timesheets.forEach(function(timesheet) {
			if (moment(timesheet.date) >= moment(targetRange.from) &&
				  moment(timesheet.date) <= moment(targetRange.to)) {
				var timechunks = Timechunks.find({'timesheet': timesheet._id, 'project': projectID});
				timechunks.forEach(function(timechunk) {
					contributorTotalHours += timechunkHours(timechunk.startTime, timechunk.endTime);
				});
			}
		});

		return contributorTotalHours;
	},
	// returns date
	targetDateRange() {
    var targetRange = Session.get('selectedTargetRange');

    if (!targetRange) {
    	targetRange = {
    		date: moment().format("YYYY-MM-DD"),
    		period: "week",
    		from: moment().startOf('week').format("YYYY-MM-DD"),
    		to: moment().endOf('week').format("YYYY-MM-DD"),
    	};
    	Session.set('selectedTargetRange', targetRange);
    }

    return targetRange;
	},
	isDateRange() {
		var targetRange = Session.get('selectedTargetRange');
		return targetRange.period === 'dateRange';
	},
	isProjectToggled(ID) {
		return Session.get(ID);
	},
	isContributorToggled(contributorID, projectID) {
		var ID = contributorID + projectID;
	 	return Session.get(ID);
	},
})

Template.teamTimesheets.events({
	// decrements selectedTargetRange by one
  'click .previous'(event) {
    event.preventDefault();

    var targetRange = Session.get('selectedTargetRange');
    targetRange.date = moment(moment(targetRange.date).subtract(1, targetRange.period)).format('YYYY-MM-DD');
    targetRange.from = moment(targetRange.date).startOf(targetRange.period).format("YYYY-MM-DD");
    targetRange.to = moment(targetRange.date).endOf(targetRange.period).format("YYYY-MM-DD");

    Session.set('selectedTargetRange', targetRange);
  },
  // increments selectedTargetRange by one
  'click .next'(event) {
    event.preventDefault();

    var targetRange = Session.get('selectedTargetRange');

    if (targetRange.period === 'week') {
    	if (moment(targetRange.date).week() < moment(moment().week()) ||
    		  moment(targetRange.date).year() < moment(moment().year())) {
    		targetRange.date = moment(moment(targetRange.date).add(1, targetRange.period)).format('YYYY-MM-DD');
    	}
    }

    if (targetRange.period === 'month') {
    	if (moment(targetRange.date).month() < moment(moment().month()) ||
    		  moment(targetRange.date).year() < moment(moment().year())) {
    		targetRange.date = moment(moment(targetRange.date).add(1, targetRange.period)).format('YYYY-MM-DD');
    	}
    }

    if (targetRange.period === 'day') {
    	if (moment(targetRange.date).day() < moment(moment().day()) ||
    		  moment(targetRange.date).year() < moment(moment().year())) {
    		targetRange.date = moment(moment(targetRange.date).add(1, targetRange.period)).format('YYYY-MM-DD');
    	}
    }

    targetRange.from = moment(targetRange.date).startOf(targetRange.period).format("YYYY-MM-DD");
    targetRange.to = moment(targetRange.date).endOf(targetRange.period).format("YYYY-MM-DD");

    Session.set('selectedTargetRange', targetRange);
  },
  // changes selectedTargetRange session variable
  'change #selectTimeframe': function(event) {
  	var targetRange = Session.get('selectedTargetRange');
  	var period = $('#selectTimeframe').val();

	  targetRange.date = moment().format("YYYY-MM-DD");
	  targetRange.period = period;

  	if (targetRange !== 'dateRange') {
	   	targetRange.from = moment().startOf(period).format("YYYY-MM-DD");
	   	targetRange.to = moment().endOf(period).format("YYYY-MM-DD");
	   	Session.set('selectedTargetRange', targetRange);
	  } else {
	   	targetRange.from = moment().format("YYYY-MM-DD");;
	   	targetRange.to = moment().format("YYYY-MM-DD");;
	  }
	  Session.set('selectedTargetRange', targetRange);
  },
  // refreshes session variable when date field is selected
  'change #fromDate': function(event) {
  	var targetRange = Session.get('selectedTargetRange');
  	var fromDate = $('#fromDate').val();
  	targetRange.from = moment(fromDate).format('YYYY-MM-DD');
  	Session.set('selectedTargetRange', targetRange);
  },
  // refreshes session variable when date field is selected
  'change #toDate': function(event) {
  	var targetRange = Session.get('selectedTargetRange');
  	var toDate = $('#toDate').val();
  	targetRange.to = moment(toDate).format('YYYY-MM-DD');
  	Session.set('selectedTargetRange', targetRange);
  },
  'click .toggle': function(event) {
  	var toggle = Session.get(event.currentTarget.id);

  	if (!toggle) {
  		Session.set(event.currentTarget.id, true);
  	} else {
  		Session.set(event.currentTarget.id, false);
  	}
  }
})