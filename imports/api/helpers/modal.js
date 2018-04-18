import { Meteor } from 'meteor/meteor';

Meteor.methods({

	editProjectModal: function(id) {
		Session.set('selectedProjectID', id);
		Modal.show('newProject');
	},

	editEmployeeModal: function(id) {
		Session.set('selectedEmployeeID', id);
		Modal.show('newEmployee');
	},

	editTimesheetModal: function(id) {
		Session.set('selectedTimechunkID', id);
		Modal.show('newTimesheet');
	},
});