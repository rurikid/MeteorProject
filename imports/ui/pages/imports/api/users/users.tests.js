// Tests for the behavior of the users collection
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Users } from './users.js';

if (Meteor.isServer) {
  describe('users collection', function () {
    it('insert correctly', function () {
      const userID = Users.insert({
        firstName = 'Jeremy',
        lastName = 'Crumpton',
        position = 'Administrator',
        salary = 1000000,
        payData = "Nothing here yet",
      });
      const added = Users.find({ _id: projectID });
      const collectionName = added._getCollectionName();
      const count = added.count();

      assert.equal(collectionName, 'users');
      assert.equal(count, 1);
    });
  });
}