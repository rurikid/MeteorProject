// All timechunks-related publications

import { Meteor } from 'meteor/meteor';
import { Timechunks } from '../timechunks.js';

Meteor.publish('timechunks.all', function () {
  return Timechunks.find();
});