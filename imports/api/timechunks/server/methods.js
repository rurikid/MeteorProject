// Methods related to timechunks

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Timechunks } from '../timechunks.js';
import { Timesheets } from '../../timesheets/timesheets.js';

Meteor.methods({

	insertTimechunk: function(timechunk, timesheet) {

		check(timechunk.project, String);
		check(timechunk.startTime, String);
		check(timechunk.endTime, String);

		var parentTimesheet = Timesheets.findOne({'date': timesheet.date, 'employee': timesheet.employee}); 

		var id = parentTimesheet && parentTimesheet._id

		return Timechunks.insert({
			"timesheet": id,
			"project": timechunk.project,
			"startTime": timechunk.startTime,
			"endTime": timechunk.endTime,
			"employee": timechunk.employee,
		});
	},

	deleteTimechunk(id) {
		check(id, String);

    return Timechunks.remove({ _id: id }, function (error, result) {
    	if (error) {
    		console.log("Error removing timesheet: ", error);
    	} else {
    		console.log("Timesheet removed: " + result);
    	}
    });
	},

	deleteTimechunkWithTimeSheeId(timesheeId) {
		check(timesheeId, String);

    return Timechunks.remove({ timesheet: timesheeId }, function (error, result) {
    	if (error) {
    		console.log("Error removing timechunk: ", error);
    	} else {
    		console.log("Timechunk removed: " + result);
    	}
    });
	},

	editTimechunk(timechunk) {
		check(timechunk.project, String);
		check(timechunk.startTime, String);
		check(timechunk.endTime, String);

		return Timechunks.update(timechunk.id, {$set: {
			project: timechunk.project,
			startTime: timechunk.startTime,
			endTime: timechunk.endTime
		}})
	},
})