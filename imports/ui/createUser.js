import { Template } from 'meteor/templating';

import { Users } from '../api/Users.js'

import './createUser.html';

// this isn't functional yet
  Template.createUser.events({
    'submit .createUser': function(event) {
      event.preventDefault();
      var firstNameVar = event.target.firstName.value;
      var lastNameVar = event.target.lastName.value;
      var positionVar = event.target.position.value;
      var usernameVar = event.target.userID.value;
      var passwordVar = event.target.password.value;
      var salaryVar = event.target.salary.value;
      var payDataVar = event.target.payData.value;
      var emailVar = event.target.email.value;
      Accounts.createUser({
        firstName: firstNameVar,
        lastName: lastNameVar,
        position: positionVar,
        username: usernameVar,
        password: passwordVar,
        salary: salaryVar,
        payData: payDataVar,
        email: emailVar
      });
    }
  });