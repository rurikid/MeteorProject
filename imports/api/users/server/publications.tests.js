// Tests for the users publications
//
// https://guide.meteor.com/testing.html

// I don't know if this actually works - JC

import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Users } from '../users.js';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publications.js';

describe('users publications', function () {
  beforeEach(function () {
    Users.remove({});
    Users.insert({
      firstName: 'Jeremy',
      lastName: 'Crumpton',
      position: 'Administrator',
      salary: 1000000,
      payData: 'None Here',
    });
  });

  describe('users.all', function () {
    it('sends all users', function (done) {
      const collector = new PublicationCollector();
      collector.collect('users.all', (collections) => {
        assert.equal(collections.users.length, 1);
        done();
      });
    });
  });
});