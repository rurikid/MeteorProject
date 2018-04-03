import { Users } from '../../../api/users/Users.js';
import { Projects } from '../../../api/projects/Projects.js'

import './newProject.html'

// TODO
//   Integrate with Database
//   Create New Project Logic

// // this isn't entirely functional yet
// Template.newProject.events({
//   'click #createProject': function(e, t) {
//     e.preventDefault();
//     // Retrieve the input field values
//     var name = $('#name').val(),
//         supervisor = $('#supervisor').val();
//         customer = $('#customer').val();
//         budget = $('#budget').val();
//         employee = $('#employee').val();

//   }
// });

// Template.newProject.helpers({
// 	project() {
// 		return Projects.find();
// 	},
// });