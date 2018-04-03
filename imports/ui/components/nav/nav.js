import { Users } from '../../../api/users/Users.js';

import './nav.html';

Template.nav.events({
  'click .logout': function(event){
    event.preventDefault();
    Meteor.logout();
    FlowRouter.go('/login');
  },
  'click .login': function(event){
    event.preventDefault();
    FlowRouter.go('/login');
  },
  'click .profile': function(event){
    event.preventDefault();
    FlowRouter.go('/profile');
  },
  'click .projects': function(event){
    event.preventDefault();
    FlowRouter.go('/projects');
  },
  'click .timesheet': function(event){
    event.preventDefault();
    FlowRouter.go('/timesheet');
  },
  'click .team': function(event){
    event.preventDefault();
    FlowRouter.go('/team');
  },
  'click .teamTimesheet': function(event){
    event.preventDefault();
    FlowRouter.go('/teamTimesheet');
  },
  'click .reports': function(event){
    event.preventDefault();
    FlowRouter.go('/reports');
  },
  'click .employees': function(event){
    event.preventDefault();
    FlowRouter.go('/employees');
  }
});