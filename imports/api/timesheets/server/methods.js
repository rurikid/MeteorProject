// Methods related to timesheets

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Timesheets } from '../timesheets.js';
import { Timechunks } from '../../timechunks/timechunks.js';

Meteor.methods({

	insertTimesheet: function(timesheet, timechunk) {
		check(timesheet.date, String);
		check(timesheet.employee, String);

		var date = timesheet.date;
		var employee = timesheet.employee;

		// insert new timesheet
		Timesheets.insert({'date': date,'employee': employee});

		// insert timechunk
		Meteor.call('insertTimechunk', timechunk, timesheet, (error) => {
			if (error) {
				alert(error.error);
			}
		});
	},
})