// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Users } from '../../api/users/users.js';
import { Projects } from '../../api/projects/projects.js';
import { Timesheets } from '../../api/timesheets/timesheets.js';

Meteor.startup(() => {
  // if the Users collection is empty
  // not yet functional
  // if (Meteor.users.find().count() === 0) {
  //   const data = [
  //     {
  //       username: 'admin',
  //       email: 'admin@admin.com',
  //       password: 'password',
  //     },
  //   ];
  //   data.forEach(user => Meteor.users.insert(user));
  // }
});