// Tests for users methods
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Users } from './users.js';
import './methods.js';

if (Meteor.isServer) {
  describe('users methods', function () {
    beforeEach(function () {
      Users.remove({});
    });

    it('can add a new user', function () {
      const addEmployee = Meteor.server.method_handlers['users.insert'];

      addEmployee.apply({}, ['Jeremy', 'Crumpton', 'Administrator', 1000000, 'Nothing Here']);

      assert.equal(Users.find().count(), 1);
    });
  });
}