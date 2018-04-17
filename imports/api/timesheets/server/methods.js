// Methods related to timesheets

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Timesheets } from '../timesheets.js';

Meteor.methods({

	insertTimesheet: function(timesheet) {
		check(timesheet.date, String);
		check(timesheet.employee, String);
		check(timesheet.timechunk.project, String);
		check(timesheet.timechunk.startTime, String);
		check(timesheet.timechunk.endTime, String);

		var date = timesheet.date;
		var employee = timesheet.employee;
		var timechunk = [timesheet.timechunk];

		return Timesheets.insert({'date': date,'employee': employee,'timechunks': timechunk});
	},

	insertTimechunk: function(timechunk, date, memberID) {

		check(timechunk.project, String);
		check(timechunk.startTime, String);
		check(timechunk.endTime, String);

		var timesheet = Timesheets.findOne({'date': date, 'employee': memberID});

		return Timesheets.update(timesheet._id, {$push: {
			'timechunks': timechunk,
		}});
	},
})