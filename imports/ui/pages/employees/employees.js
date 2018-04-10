import { Users } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import './employees.html';

// TODO
//   Integrate with Database
//   Get Employees Logic

Template.employees.onCreated(function () {
    Meteor.subscribe('users.all');
  });

Template.employees.helpers({
  // returns all users
  users() {
    return Meteor.users.find({});
  },
  // returns true for admin
  isAdmin() {
    return (Meteor.user().profile.position === 'Administrator');
  },
});

Template.employees.events({
  'click .newEmployee': function(event){
    event.preventDefault();
    FlowRouter.go('/newEmployee');
  }
});