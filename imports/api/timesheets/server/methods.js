// Methods related to timesheets

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Timesheets } from '../timesheets.js';
import { Timechunks } from '../timesheets.js';

Meteor.methods({

	insertTimesheet: function(timesheet) {
		// check(timesheet.date, String);
		check(timesheet.employee, String);

		var date = timesheet.date;
		var employee = timesheet.employee;

		var timesheetCheck = Timesheets.findOne({'date': date, 'employee': employee});

		if (!timesheetCheck) {
			return Timesheets.insert({
				date,
				employee,
			});
		}
	},

	insertTimechunk: function(timechunk) {
		check(timechunk.project, String);
		// check(timechunk.startTime, String);
		// check(timechunk.endTime, String);
		check(timechunk.timesheet, String);

		var project = timechunk.project;
		var startTime = timechunk.startTime;
		var endTime = timechunk.endTime;
		var timesheet = timechunk.timesheet;

		return Timechunks.insert({
			timesheet,
			project,
			startTime,
			endTime,
		});
	},
})