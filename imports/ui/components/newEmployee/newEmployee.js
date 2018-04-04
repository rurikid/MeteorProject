import { Users } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import './newEmployee.html';

Template.newEmployee.onCreated(function () {
  Meteor.subscribe('users.all');
});

Template.newEmployee.helpers({
  users() {
    return Meteor.users.find({});
  },
});

Template.newEmployee.events({
  'submit .newEmployee'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const firstName = target.firstName;
    const lastName = target.lastName;
    const position = target.position;
    const salary = target.salary;
    const payData = target.payData;
    const username = target.username;
    const password = target.password;
    const confPassword = target.confPassword;

    // Check password is at least 6 chars long
    var isValidPassword = function(pwd, pwd2) {
      if (pwd === pwd2) {
        return pwd.length >= 6 ? true : false;
      } else {
        return swal({
          title: "Passwords don't match",
          text: "Please try again",
          button: {
            text: "Confirm",
          },
          icon: "error"
        });
      }
    }

    // If validation passes, supply the appropriate fields to the
    // Accounts.createUser function.
    if (isValidPassword(password, confPassword)) {
      Meteor.call('createUserFromAdmin', firstName.value, lastName.value, position.value, salary.value, payData.value, email.value, password.value, username.value, function(error) {
        if (error) {
          // error alert
          return swal({
            title: error.reason,
            text: "Please try again",
            button: {
              text: "Confirm",
            },
            icon: "error"
          });
        } else {

          // Clear form
          firstName.value = '';
          lastName.value = '';
          position.value = '';
          salary.value = '';
          payData.value = '';
          email.value = '';
          username.value = '';
          password.value = '';
          confPassword.value = '';

          // success alert
          return swal({
            title: "Success",
            text: "New Employee Added",
            button: {
              text: "Close",
            },
            icon: "success"
          });
        }
      });
    }
    return false;
  }
});