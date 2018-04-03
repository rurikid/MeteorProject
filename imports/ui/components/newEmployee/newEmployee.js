import { Users } from '../../../api/users/Users.js';

import './newEmployee.html';

// currently only inserts email and password to database
// logs user into newly created role

// TODO
//   Implement full functionality
//   Disable auto-login

Template.newEmployee.events({
  'click #createEmployee': function(e, t) {
    e.preventDefault();
    // Retrieve the input field values
    var email = $('#email').val(),
        firstName = $('#firstName').val(),
        lastName = $('#lastName').val(),
        position = $('#position').val(),
        salary = $('#salary').val(),
        password = $('#password').val(),
        payData = $('#payData').val(),
        username = $('#username').val(),
        confPassword = $('#confPassword').val();

    // Trim Helper
//    var trimInput = function(val) {
//      return val.replace(/^\s*|\s*$/g, "");
//    }
//    var email = trimInput(email);
  
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
      Accounts.createUser({
        email: email,
        firstName: firstName,
        lastName: lastName,
        position: position,
        salary: salary,
        password: password,
        payData: payData,
        username: username
      }, function(error) {
        if (error) {
          return swal({
            title: error.reason,
            text: "Please try again",
            button: {
              text: "Confirm",
            },
            icon: "error"
          });
        } else {
          FlowRouter.go('/');
        }
      });
    }
    return false;
  }
});