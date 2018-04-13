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
  'click #back': function(event){
    event.preventDefault();

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

    // close modal
    $('#newEmployeeModal').modal('hide');
  },

  'click #clear': function(event){
    event.preventDefault();

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
  },

  'click #submit': function(event) {
    // Prevent default browser behavior
    event.preventDefault();

    // Get value from form element
    var employee = {
      firstName: $('#firstName').val(),
      lastName: $('#lastName').val(),
      position: $('#position').val(),
      salary: $('#salary').val(),
      payData: $('#payData').val(),
      email: $('#email').val(),
      username: $('#username').val(),
      password: $('#password').val(),
      confPassword: $('#confPassword').val(),
    }

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
    if (isValidPassword(employee.password, employee.confPassword)) {
      Meteor.call('createUserFromAdmin', employee, function(error) {
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