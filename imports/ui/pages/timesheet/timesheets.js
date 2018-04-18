import { Projects } from '/imports/api/projects/projects.js';
import { Users } from '/imports/api/users/users.js';
import { Timesheets } from '/imports/api/timesheets/timesheets.js';
import { Timechunks } from '/imports/api/timechunks/timechunks.js';
import { Meteor } from 'meteor/meteor';
import '/imports/api/helpers/modal.js';
import './timesheets.html';

Template.timesheets.onCreated(function () {
  Meteor.subscribe('projects.all');
  Meteor.subscribe('users.all');
  Meteor.subscribe('timesheets.all');
  Meteor.subscribe('timechunks.all');
});

Template.timesheets.helpers({
  // returns all user timesheets
  timesheets() {
    return Timesheets.find({});
  },
  // returns all associated timechunks
  timechunks: function(id) {
    return Timechunks.find({'timesheet': id});
  },
  // finds and retrieves project name
  getProjectName: function(project) {
    // search for project
    var result = Projects.findOne({"_id": project});

    // known as guarding (are we finding anything in the query)
    var name = result && result.name;

    return result.name;
  },
  // determines if an employee can modify a timesheet
  isTimely: function(date) {
    return (moment(date).week() >= moment(moment().subtract(1, 'week')).week());
  },
  // returns true if the current user owns the timesheet
  isOwner: function(timesheetID) {
    return (timesheetID === Meteor.user()._id);
  },
})

Template.timesheets.events({
  'click .deleteTimesheet'(event) {
    // Prevent default browser behavior
    event.preventDefault();

    // Get value from form element
    const ids = document.getElementsByName('timechunkID');
    var id;
    for (i = 0; i < ids.length; i++) {
       if (ids[i].checked){
         id = ids[i].value; 
       }
    }

    Meteor.call('deleteTimechunk', id, (error) => {
      if (error) {
        alert(error.error);
      } else {

        // success alert
        return swal({
          title: "Removed!",
          text: "Timesheet Removed",
          button: {
            text: "Close",
          },
          icon: "success"
        });
      }
    });
  },

  'click .newTimesheet'(event) {
  	// Prevent default browser behavior
  	event.preventDefault();
    Meteor.call('editTimesheetModal', null);
  },

  'click .editTimesheet'(event) {
  	// Prevent default browser behavior
  	event.preventDefault();

  	// get value from form element
  	const ids = document.getElementsByName('timechunkID');
  	var id;
  	for (i = 0; i < ids.length; i++) {
  	 	if (ids[i].checked){
  	 		id = ids[i].value;
  	 	}
  	}

    Meteor.call('editTimesheetModal', id);
  },
});