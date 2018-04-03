import { Users } from '../../../api/users/Users.js';
import { Projects } from '../../../api/projects/Projects.js'

import './editProject.html'

// TODO
//   Integrate with Database
//   Select Project Logic
//   Update Project Logic

// // this isn't functional yet
// Template.editProject.events({
//   'click #editProject': function(e, t) {
//     e.preventDefault();
//     // Retrieve the input field values
//     var name = $('#name').val(),
//         supervisor = $('#supervisor').val();
//         customer = $('#customer').val();
//         budget = $('#budget').val();
//         employee = $('#employee').val();
// });

// Template.editProject.helpers({
// 	project() {
// 		return Projects.find();
// 	},
// });