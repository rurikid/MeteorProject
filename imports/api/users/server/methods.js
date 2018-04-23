// Methods related to users

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Users } from '../users.js';
import { Projects } from '../../projects/projects.js';
import { Timechunks } from '../../timechunks/timechunks.js';
import { Timesheets } from '../../timesheets/timesheets.js';

Accounts.onCreateUser(function(options, user) {
   // Use provided profile in options, or create an empty object
   user.profile = options.profile || {};
   // Assigns first and last names to the newly created user object
   user.profile.firstName = options.firstName;
   user.profile.lastName = options.lastName;
   user.profile.position = options.position;
   user.profile.salary = options.salary;
   user.profile.payData = options.payData;
   // Returns the user object
   return user;
});

Meteor.methods({
	createUserFromAdmin:function(employee){
		Accounts.createUser({
			firstName: employee.firstName,
			lastName: employee.lastName,
			position: employee.position,
			salary: employee.salary,
			payData: employee.payData,
			email: employee.email,
			password: employee.password,
			username: employee.username
		})
	},

  editEmployee(employee) {
    check(employee.firstName, String);
    check(employee.lastName, String);
    check(employee.position, String);
    check(employee.salary, String);
    check(employee.payData, String);

    var newProfile = {
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: employee.position,
      salary: employee.salary,
      payData: employee.payData,
    }

    // updates projects in case of supervisor demotion
    var oldEmployee = Meteor.users.findOne({'_id': employee.id});
    var oldPosition = oldEmployee && oldEmployee.profile && oldEmployee.profile.position;
    
    if (newProfile.position === "Employee" &&
       (oldPosition === "Supervisor" ||
        oldPosition === "Administrator")) {

      Meteor.call('removedSupervisor', employee.id, function (error, result) {
        if (error) {
          console.log("Error updating project supervisor: ", error);
        } else {
          console.log("Project supervisor updated: " + result);
        }
      });
    }

    return Meteor.users.update(employee.id, {$set: {
      username: employee.username,
      password: employee.password,
      profile: newProfile,
    }})
  },

	deleteEmployee(id) {
    check(id, String);

    var timesheets = Timesheets.find({'employee': id});

    timesheets.forEach(function(timesheet) {
      Timechunks.remove({'timesheet': timesheet._id});
      Timesheets.remove({'_id': timesheet._id});
    });

    var projects = Projects.find({'employees': id});

    projects.forEach(function (project) {
      var employees = project.employees;
      if (employees.indexOf(id) > -1) {
        employees.splice(employees.indexOf(id), 1)
      }
      project.employees = employees;

      Meteor.call('editProject', project, function (error) {
        if (error) {
          console.log(error.error);
        } else {
          console.log("Employee Removed From Project");
        }
      });
    })

    return Meteor.users.remove({ _id: id }, function (error, result) {
    	if (error) {
    		console.log("Error removing user: ", error);
    	} else {
    		console.log("User removed: " + result);
    	}
    });
  },
})