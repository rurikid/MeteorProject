import { Users } from '/imports/api/users/users.js';
import { Timesheets } from '/imports/api/timesheets/timesheets.js';
import { Timechunks } from '/imports/api/timechunks/timechunks.js';
import { Meteor } from 'meteor/meteor';
import '/imports/api/helpers/modal.js';
import { Projects } from '../../../api/projects/projects.js'

//MS ADDED--------------
import  '../../../ui/pages/reports/reports.js'


import './generatedReports.html';

Template.generatedReports.onCreated( function () {
    console.log("On Rendered Params",FlowRouter.getParam("reportType"));
});


Template.generatedReports.events({

        'click #back': function(event){
          event.preventDefault();
              //$('#editProjectModal').modal('hide');
        },
});

Template.generatedReports.helpers({ 
    
    tableItems() {
        var projectId = Session.get("projectId");
        var project = Projects.findOne({"_id": projectId});
        var employees = project.employees;
        console.log(employees);
        
        var users = Meteor.users.find({"_id": {"$in": employees}});
        console.log(users);
        //return Meteor.users.find({});
        return users;
    },

      // finds and retrieves project name
  getProjectName: function(project) {
    // search for project
    var result = Projects.findOne({"_id": project});

    // known as guarding (are we finding anything in the query)
    var name = result && result.name;

    return result.name;
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
      console.log("!targetWeek");
    }

    console.log('get ' + targetWeek);
    return moment(targetWeek).startOf('week').format("MMMM Do YYYY");
  },
  getHumanDate: function(date) {
    return (moment(date).format('dddd, MMMM Do YYYY'));
  }
});
