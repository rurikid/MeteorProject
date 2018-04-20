// All timesheets-related publications

import { Meteor } from 'meteor/meteor';
import { Timesheets } from '../timesheets.js';

Meteor.publish('timesheets.all', function () {
  return Timesheets.find();
});