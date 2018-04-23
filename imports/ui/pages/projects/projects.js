import { Projects } from '/imports/api/projects/projects.js';
import { Users } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import '/imports/api/helpers/modal.js';
import './projects.html';

Template.projects.onCreated(function () {
  Meteor.subscribe('projects.all');
  Meteor.subscribe('users.all');
  
});

Template.projects.helpers({
  // returns all projects
  projects() {
    return Projects.find({});
  },
  // returns all users
  users() {
    return Meteor.users.find({});
  },
  // evaluates for admins
  isAdmin() {
    return Meteor.user().profile.position === 'Administrator';
  },
  // evaluates for supervisors
  isSupervisor() {
    return Meteor.user().profile.position === 'Supervisor';
  },  
  isProjectSupervisor(supervisorID) {
    return (Meteor.user().profile.position === 'Administrator' || Meteor.user()._id === supervisorID);
  },
  // finds and retrieves supervisor name
  getUserName: function(supervisor) {
    // search for supervisorID
    var result = Meteor.users.findOne({"_id": supervisor});

    // known as guarding (are we finding anything in the query)
    var firstName = result && result.profile && result.profile.firstName;
    var lastName = result && result.profile && result.profile.lastName;

    if (!result) {
      return "None Assigned"
    }

    return (firstName + " " + lastName);
  },
  // determines if a user belongs to a project
  isMember: function(projectID) {
    // search Projects for ProjectID
    var project = Projects.findOne({"_id": projectID});
    // guarding
    var supervisor = project && project.supervisor;
    var employees = project && project.employees;

    var isMember = false;
    employees.forEach(function(employee) {
      if (employee === Meteor.user()._id) {
        isMember = true;
      }
    });

    return (isMember || Meteor.user().profile.position === 'Administrator' || Meteor.user()._id === supervisor);
  },
  // returns whether current user is an employee, supervisor, or not in project
  getUserRole: function(supervisorID, employees) {
    if (supervisorID === Meteor.user()._id) {
      return "Supervisor";
    }

    var userRole = "Administrator"; 
    employees.forEach(function(employee) {
      if (employee === Meteor.user()._id && Meteor.user().profile.position !== 'Administrator') {
        userRole = "Employee";
      }
    });

    return userRole;
  },
  // returns true for the project supervisor and administrators
  isProjectSupervisor: function(supervisorID) {
    return (supervisorID === Meteor.user()._id || Meteor.user().profile.position === "Administrator");
  },
  // returns all employees within project
  getProjectEmployees(employees) {
    var projectEmployees = employees;
    var result = [];

    projectEmployees.forEach(function(employee) {
      result.push(Meteor.users.findOne({'_id': employee}));
    });

    return result;
  },
  isToggled(ID) {
    return Session.get(ID);
  },
});

Template.projects.events({
  'click .deleteProject'(event) {
    // Prevent default browser behavior
    event.preventDefault();

    // Get value from form element
    const ids = document.getElementsByName('projectID');
    var id;
    for (i = 0; i < ids.length; i++) {
      if (ids[i].checked){
        id = ids[i].value; 
      }
    }

    Meteor.call('deleteProject', id, (error) => {
      if (error) {
        alert(error.error);
      } else {

        // success alert
        return swal({
          title: "Removed!",
          text: "Project Removed",
          button: {
            text: "Close",
          },
          icon: "success"
        });
      }
    });
  },

  'click .newProject'(event) {
    // Prevent default browser behavior
    event.preventDefault();
    Meteor.call('editProjectModal', null);
  },

  'click .editProject'(event) {
    // Prevent default browser behavior
    event.preventDefault();

    // get value from form element
    const ids = document.getElementsByName('projectID');
    var id;
    for (i = 0; i < ids.length; i++) {
      if (ids[i].checked){
        id = ids[i].value;
      }
    }

    if (id) {
      Meteor.call('editProjectModal', id);
    }
  },
  'click .toggle': function(event) {
    var toggle = Session.get(event.currentTarget.id);

    if (!toggle) {
      Session.set(event.currentTarget.id, true);
    } else {
      Session.set(event.currentTarget.id, false);
    }
  }
});
