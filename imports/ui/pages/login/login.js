import { Template } from 'meteor/templating';

import { Users } from '../../../api/users/Users.js';

import './login.html';

Template.login.events({
  'submit form': function(event){
    event.preventDefault();
    var username = $('[name=username]').val();
    var password = $('[name=password]').val();
    Meteor.loginWithPassword(email, password);
  }
});