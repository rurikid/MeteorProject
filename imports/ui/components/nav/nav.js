import { Users } from '../../../api/users/Users.js';

import './nav.html';

Template.nav.events({
  'click .logout': function(event){
    event.preventDefault();
    Meteor.logout();
    FlowRouter.go('/login');
  }
});