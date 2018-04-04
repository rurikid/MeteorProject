// Methods related to projects

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Projects } from './projects.js';

Meteor.methods({
  'projects.insert'(name, supervisor, client, budget) {
    check(name, String);
    check(supervisor, String);
    check(client, String);

    return Projects.insert({
      name,
      supervisor,
      client,
      budget,
    });
  },
});