import { Users } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import { Timesheets } from '/imports/api/timesheets/timesheets.js';
import { Timechunks } from '/imports/api/timechunks/timechunks.js';
import './employees.html';
import { Projects } from '/imports/api/projects/projects.js';
// TODO
//   Integrate with Database
//   Get Employees Logic

Template.employees.onCreated(function () {
    Meteor.subscribe('users.all');
    Meteor.subscribe('timesheets.all');
    Meteor.subscribe('timechunks.all');
    Meteor.subscribe('projects.all');
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
        //Getting list of projects this employee is part of and then removing from project
        var projects = Projects.find({"employees": id}).fetch();
        projects.forEach(function (project) {
            var employeesArray = project["employees"];
            console.log("printing employee after before", employeesArray);
            var index = employeesArray.indexOf(id);
            if (index > -1) {
              employeesArray.splice(index, 1);
            }
            console.log("printing employee after before", employeesArray);
            project["employees"] = employeesArray;

            Meteor.call('updateProject', project, function (error) {
              if (error) {
                console.log(error.error);
              } else {
                // success alert
                console.log("Project updated successfully");
              }
            });
       });

        //Get all timesheets for this employee
        var timeSheets = Timesheets.find({employee: id}).fetch();
        //Iterating through all the timesheets
        timeSheets.forEach(function (timeSheet) {
            console.log("Printing timesheet Id",timeSheet._id);
            //Deleting all timechunks associated with a time sheet
            Meteor.call('deleteTimechunkWithTimeSheeId', timeSheet._id);

            //Delete the time sheet after deleting the time chunck
            Meteor.call('deleteTimesheet', timeSheet._id);
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