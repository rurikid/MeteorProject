import { Users } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import './newEmployee.html';

// enforces form completeness and proper standards
function validateEmployee(employee) {

  // evaluates for void fields
  if (employee.firstName === '' ||
      employee.lastName === '' ||
      employee.position === '' ||
      employee.salary === '' ||
      employee.payData === '' ||
      employee.email === '' ||
      employee.username === '' ||
      employee.password === '' ||
      employee.confPassword === '') {
    return "Please complete all fields!";
  }
}

Template.newEmployee.onCreated(function () {
  Meteor.subscribe('users.all');
});

Template.newEmployee.helpers({
  employee: function() {
    var employeeID = Session.get('selectedEmployeeID');

    if (typeof employeeID !== "undefined") {
      var employee = Meteor.users.findOne({"_id": employeeID});
      return employee;
    } else {
      return {
        firstName: '',
        lastName: '',
        position: '',
        salary: '',
        payData: '',
        email: '',
        username: '',
        password: '',
        confPassword: ''
      }
    }
  },

  isNew: function() {
    return ((Session.get('selectedEmployeeID') === null) ? true : false);
  },

  positionCheck: function(position) {
    var employeeID = Session.get('selectedEmployeeID');
    if (employeeID === null) {
      return '';
    } else {
      var employee = Meteor.users.findOne({"_id": employeeID});
      return ((employee.profile.position === position) ? "selected" : ''); 
    }
  },

  label: function() {
    var employeeID = Session.get('selectedEmployeeID');

    if (employeeID === null) {
      return "Add New Employee";
    } else {
      return "Update Employee";
    }
  },

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
    if (Session.get('selectedEmployeeID') === null) {
      email.value = '';
      username.value = '';
      password.value = '';
      confPassword.value = '';
    }

    // close modal
    Modal.hide('newEmployee');
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

    var employeeID = Session.get('selectedEmployeeID');

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

    var checkEmployee = validateEmployee(employee);
    if (checkEmployee) {
      return swal({
        title: "Error",
        text: checkEmployee,
        button: {
          text: "Confirm",
        },
        icon: "error"
      });
    }

    if (!employeeID) {

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

    } else {
      // if (isValidPassword(employee.password, employee.confPassword)) {
        _.extend(employee, {id: employeeID});
        Meteor.call('editEmployee', employee, (error) => {
          if (error) {
            alert(error.error);
          } else {

            // success alert
            return swal({
              title: "Success",
              text: "Employee Updated",
              button: {
                text: "Close",
              },
              icon: "success"
            });
          }
        });
      // }
    }

    // Clear form
    firstName.value = '';
    lastName.value = '';
    position.value = '';
    salary.value = '';
    payData.value = '';
    if (Session.get('selectedEmployeeID') === null) {
      email.value = '';
      username.value = '';
      password.value = '';
      confPassword.value = '';
    }

    // dismiss modal
    Modal.hide('newEmployee');
  }
});