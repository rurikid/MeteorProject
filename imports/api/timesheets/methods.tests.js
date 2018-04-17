// Tests for timesheets methods
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Timesheets } from './timesheets.js';
import './methods.js';

// if (Meteor.isServer) {
//   describe('timesheets methods', function () {
//     beforeEach(function () {
//       Timesheets.remove({});
//     });

//     it('can add a new timesheets', function () {
//       const addTimesheet = Meteor.server.method_handlers['timesheets.insert'];

//       addTimesheet.apply({}, ['FireBird', 'Rurikid', 'Varangian Studios', 1000000]);

//       assert.equal(Timesheets.find().count(), 1);
//     });
//   });
// }