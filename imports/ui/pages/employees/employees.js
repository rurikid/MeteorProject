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
    users() {
      return Meteor.users.find({});
    },
  });

  Template.employees.events({
    'click .addnewmember': function(event){
      event.preventDefault();
      FlowRouter.go('/newEmployee');
    }
  });

