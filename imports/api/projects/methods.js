// Methods related to projects

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Projects } from './projects.js';

Meteor.methods({
  insertProject: function(project) {
    check(project.name, String);
    check(project.supervisor, String);
    check(project.client, String);

    var name = project.name;
    var supervisor = project.supervisor;
    var client = project.client;
    var budget = project.budget;

    return Projects.insert({
      name,
      supervisor,
      client,
      budget,
    });
  },
});