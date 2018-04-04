// Tests for links methods
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Projects } from './projects.js';
import './methods.js';

if (Meteor.isServer) {
  describe('projects methods', function () {
    beforeEach(function () {
      Projects.remove({});
    });

    it('can add a new project', function () {
      const addProject = Meteor.server.method_handlers['projects.insert'];

      addProject.apply({}, ['FireBird', 'Rurikid', 'Varangian Studios', 1000000]);

      assert.equal(Projects.find().count(), 1);
    });
  });
}