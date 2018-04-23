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
    var timesheets = [];
    var result = Timesheets.find({'employee': Meteor.user()._id});
    
    var targetWeek = Session.get('selectedTargetWeek');

    result.forEach(function(doc) {
      if (moment(doc.date).week() === (moment(targetWeek).week())) {
        timesheets.push(doc);
      }
    });
    return timesheets;
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
  // returns number of hours worked in a day
  getDailyHours: function(timesheetID) {
    var timechunks = Timechunks.find({'timesheet': timesheetID});
    var hours = 0;

    timechunks.forEach(function (doc) {
      var start = doc.startTime.split(':');
      var end = doc.endTime.split(':');

      var total = (Number(end[0]) * 60 + Number(end[1])) - (Number(start[0]) * 60 + Number(start[1]));

      hours = hours + (total / 60);

    }, function(error) {
      alert(error.error);
    })
    return hours;
  },
  // returns number of hours worked in a timechunk
  getTimechunkHours: function(startTime, endTime) {
    var start = startTime.split(':');
    var end = endTime.split(':');

    var total = (Number(end[0]) * 60 + Number(end[1])) - (Number(start[0]) * 60 + Number(start[1]));

    return total / 60;
  },
  // returns target view week
  getTargetWeek: function() {
    var targetWeek = Session.get('selectedTargetWeek');

    if (!targetWeek) {
      var newWeek = moment().format("YYYY-MM-DD");
      Session.set('selectedTargetWeek', newWeek);
      targetWeek = newWeek;
    }

    return moment(targetWeek).startOf('week').format("MMMM Do YYYY");
  },
  getHumanDate: function(date) {
    return (moment(date).format('dddd, MMMM Do YYYY'));
  },
  isToggled(ID) {
    return Session.get(ID);
  }
})

Template.timesheets.events({
  'click .previousWeek'(event) {
    event.preventDefault();

    var targetWeek = Session.get('selectedTargetWeek');
    var newWeek = moment(moment(targetWeek).subtract(1, 'week')).format('YYYY-MM-DD');
    Session.set('selectedTargetWeek', newWeek);
  },
  'click .nextWeek'(event) {
    event.preventDefault();

    var targetWeek = Session.get('selectedTargetWeek');
    if (moment(targetWeek).week() < moment(moment()).week() ||
        moment(targetWeek).year() < moment(moment()).year()) {
      var newWeek = moment(moment(targetWeek).add(1, 'week')).format('YYYY-MM-DD');
      Session.set('selectedTargetWeek', newWeek);
    }
  },
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

    if (id) {
      Meteor.call('editTimesheetModal', id);
    }
  },
  'click .toggle': function(event) {
    var toggle = Session.get(event.currentTarget.id);

    if (!toggle) {
      Session.set(event.currentTarget.id, true);
    } else {
      Session.set(event.currentTarget.id, false);
    }
  }
});