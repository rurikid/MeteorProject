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