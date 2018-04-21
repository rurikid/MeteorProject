// Methods related to users

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Users } from './users.js';

Meteor.methods({
  getCurrentUsersName: function() {
    // search for current user
    var result = Meteor.user();

    // known as guarding (are we finding anything in the query)
    var firstName = result && result.profile && result.profile.firstName;
    var lastName = result && result.profile && result.profile.lastName;

    return (firstName + " " + lastName);
  },

});