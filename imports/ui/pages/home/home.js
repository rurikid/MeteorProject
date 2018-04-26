import { Users } from '/imports/api/users/users.js';
import { Projects } from '/imports/api/projects/projects.js';
import { Timesheets } from '/imports/api/timesheets/timesheets.js';
import { ModalHelper } from '/imports/api/helpers/modal.js';

import './home.html';

import '../../components/nav/nav.js';
import '../../components/newEmployee/newEmployee.js';
import '../../components/newProject/newProject.js';
import '../../components/newTimesheet/newTimesheet.js';

import '../login/login.js';
import '../teamTimesheets/teamTimesheets.js';
import '../timesheet/timesheets.js';
import '../profile/profile.js';
import '../projects/projects.js';
import '../employees/employees.js';

Template.home.helpers({
  // finds and retrieves supervisor name
  getUsersName: function() {
    return (Meteor.user().profile.firstName + " " + Meteor.user().profile.lastName);
  },
  // evaluates for supervisors & admins
  isSupervisor: function() {
    return (Meteor.user().profile.position === 'Administrator' || Meteor.user().profile.position === 'Supervisor');
  },
  // evaluates for admins
  isAdmin: function() {
    return Meteor.user().profile.position === 'Administrator';
  },
});

Template.home.events({
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
  'click .employees': function(event){
    event.preventDefault();
    FlowRouter.go('/employees');
  }
});