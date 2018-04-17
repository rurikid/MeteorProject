import { Users } from '../../../api/users/users.js';

import './login.html';

// I don't think this needs any work

Template.login.events({
  'click #login': function(e, t) {
     e.preventDefault();
     // Getting values from fields on page
     var email = $('#email').val(),
         password = $('#password').val();
     // Calling the loginWithPassword function on the user
     Meteor.loginWithPassword(email, password, function(error) {
         if (error) {
          // return login failed alert
          return swal({
                title: "Email or password incorrect",
                text: "Please try again",
                timer: 1700,
                showConfirmButton: false,
                icon: "error"
            });
         } else {
           FlowRouter.go('/');
         }
     });
     return false;
   }
});