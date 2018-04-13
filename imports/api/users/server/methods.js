// Methods related to users

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Users } from '../users.js';

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

    return Meteor.users.update(employee.id, {$set: {
      username: employee.username,
      password: employee.password,
      profile: newProfile,
    }})
  },

	deleteEmployee(id) {
    check(id, String);

    return Meteor.users.remove({ _id: id }, function (error, result) {
    	if (error) {
    		console.log("Error removing user: ", error);
    	} else {
    		console.log("User removed: " + result);
    	}
    });
  },
})

// Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.name":"Carlos"}})