import { Users } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import { Timesheets } from '/imports/api/timesheets/timesheets.js';
import { Timechunks } from '/imports/api/timechunks/timechunks.js';
import './employees.html';


// TODO
//   Integrate with Database
//   Get Employees Logic

Template.employees.onCreated(function () {
    Meteor.subscribe('users.all');
    Meteor.subscribe('timesheets.all');
    Meteor.subscribe('timechunks.all');
  });

Template.employees.helpers({
  // returns all users
  users() {
    return Meteor.users.find({});
  },
  // returns true for admin
  isAdmin() {
    return (Meteor.user().profile.position === 'Administrator');
  },
});

Template.employees.events({
  'click .deleteEmployee'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const ids = document.getElementsByName('employeeID');
    var id;
    for (i = 0; i < ids.length; i++) {
      if (ids[i].checked){
        id = ids[i].value; 
      }
    }

    Meteor.call('deleteEmployee', id, (error) => {
      if (error) {
        alert(error.error);
      } else {
        //Get all timesheets for this employee
        var timeSheets = Timesheets.find({employee: id}).fetch();
        //Iterating through all the timesheets
        timeSheets.forEach(function (timeSheet) {
          console.log("Printing timesheet Id",timeSheet._id);
          //Deleting all timechunks associated with a time sheet
          // var timeChunks = Timechunks.find({timesheet: timeSheet._id}).fetch();
          // timeChunks.forEach(function (timeChunk) {
          //   Meteor.call('deleteTimechunk', id);
          //   //Timechunks.remove({_id: timeChunk._id});
          // });

          Meteor.call('deleteTimechunkWithTimeSheeId', timeSheet._id);

          //Delete the time sheet after deleting the time chunck
          
          Meteor.call('deleteTimesheet', timeSheet._id);
          //Timesheets.remove({_id: timeSheet._id});
        });
        // success alert
        return swal({
          title: "Removed!",
          text: "Employee Removed",
          button: {
            text: "Close",
          },
          icon: "success"
        });
      }
    });
  },

  'click .newEmployee'(event) {
    // Prevent default browser behavior
    event.preventDefault();
    Meteor.call('editEmployeeModal', null);
  },

  'click .editEmployee'(event) {
    // Prevent default browser behavior
    event.preventDefault();

    // Get value from form element
    const ids = document.getElementsByName('employeeID');
    var id;
    for (i = 0; i < ids.length; i++) {
      if (ids[i].checked){
        id = ids[i].value; 
      }
    }

    if (id) {
      Meteor.call('editEmployeeModal', id);
    }
  }
});