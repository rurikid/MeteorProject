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
	createUserFromAdmin:function(firstName, lastName, position, salary, payData, email, password, username){
		Accounts.createUser({
			firstName: firstName,
			lastName: lastName,
			position: position,
			salary: salary,
			payData: payData,
			email: email,
			password: password,
			username: username
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