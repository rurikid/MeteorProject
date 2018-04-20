// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Users } from '/imports/api/users/users.js';
import { Projects } from '/imports/api/projects/projects.js';
import { Timesheets } from '/imports/api/timesheets/timesheets.js';
import { Timechunks } from '/imports/api/timechunks/timechunks.js';

Meteor.startup(() => {
  // if the sysAdmin user does not exist
  if (Meteor.users.find({"username": "sysadmin"}, {limit: 1}).count() < 1) {
    var employee = {
      firstName: "System",
      lastName: "Administrator",
      position: "Administrator",
      salary: "5000",
      payData: "Pay Info",
      email: "admin@admin.com",
      username: "sysadmin",
      password: "password"
    }
    Meteor.call('createUserFromAdmin', employee, function(error) {
      if (error) {
        alert(error.error);
      }
    });
  }
});