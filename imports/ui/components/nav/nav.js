import { Users } from '../../../api/users/users.js';

import './nav.html';

Template.nav.helpers({
  // returns user name
  userName() {
    var userId = Meteor.user().profile;
    return userId.firstName + " " + userId.lastName;
  },
  // evaluates for supervisors
  isSupervisor: function() {
    return (Meteor.user().profile.position === 'Supervisor' || Meteor.user().profile.position === 'Administrator');
  },
  // evaluates for admin
  isAdmin: function() {
    return Meteor.user().profile.position === 'Administrator';
  },
});

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
  'click .timesheets': function(event){
    event.preventDefault();
    FlowRouter.go('/timesheets');
  },
  'click .teamTimesheets': function(event){
    event.preventDefault();
    FlowRouter.go('/teamTimesheets');
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