import { Mongo } from 'meteor/mongo';
 
export const Projects = new Mongo.Collection('Projects');

Meteor.methods({
  'createProject.add': function (newName, newSupervisor) {
    // Retrieve the input field values
    var name = $('#name').val(),
        supervisor = $('#supervisor').val();

    return Projects.insert(name, supervisor);
  },
});