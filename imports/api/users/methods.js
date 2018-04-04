// Methods related to users

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Users } from './users.js';

Meteor.methods({
  'users.update'(email, firstName, lastName, position, salary, payData) {
    check(firstName, String);
    check(lastName, String);
    check(position, String);
    check(payData, String);

    return Users.update(email, {
      $set: { firstName: firstName,
              lastName: lastName,
              position: position,
              salary: salary,
              payData: payData,
            }
    });
  },
});