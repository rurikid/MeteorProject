import { Users } from '../../../api/users/Users.js';

import './createUser.html';

// this isn't entirely functional yet
  Template.createUser.events({
    'submit form': function(event) {
      event.preventDefault();
      var firstName = $('[name=firstName]').val();
      var lastName = $('[name=lastName]').val();
      var position = $('[name=position]').val();
      var username = $('[name=username]').val();
      var password = $('[name=password]').val();
      var salary = $('[name=salary]').val();
      var payData = $('[name=payData]').val();
      var email = $('[name=email]').val();
      Accounts.createUser({
        firstName: firstName,
        lastName: lastName,
        position: position,
        username: username,
        password: password,
        salary: salary,
        payData: payData,
        email: email
      });
      Router.go('#');
    }
  });