import { Template } from 'meteor/templating';

import { Users } from '../api/Users.js';

import './login.html';

Template.loginForm.events({
  "submit #form": function(event, template) {
    event.preventDefault();
    Meteor.loginWithPassword(
      template.find("#username").value,
      template.find("#password").value,
      function(error) {
        if (error) {
          // Display the login error to the user however you want
        }
      }
    );
  }
});
