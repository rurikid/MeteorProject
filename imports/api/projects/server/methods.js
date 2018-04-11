// Methods related to users

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Projects } from '../projects.js';

Meteor.methods({

	deleteProject(id) {
    check(id, String);

    return Projects.remove({ _id: id }, function (error, result) {
    	if (error) {
    		console.log("Error removing project: ", error);
    	} else {
    		console.log("Project removed: " + result);
    	}
    });
  },
})