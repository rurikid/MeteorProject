import { Projects } from '/imports/api/projects/projects.js';
import { Users } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import './newProject.html';

// evaluates for void fields
function validateProject(project) {
	if (project.name === '' ||
		  project.client === '' ||
		  project.budget === '') {
		return "Please complete all fields!";
	}
}

Template.newProject.onCreated(function () {
  Meteor.subscribe('projects.all');
  Meteor.subscribe('users.all');
});

Template.newProject.helpers({
	project: function() {
		var projectID = Session.get('selectedProjectID');

		if (typeof projectID !== "undefined") {
			var project = Projects.findOne(projectID);
			return project;
		} else {
			return {
				name:'', 
				supervisor:'', 
				client:'',
				budget:'',
				employees:'',
			}
		}
	},
	// returns all selected member ids of multiselectbox
	selectedUsers() {
		var selectedUsers = $('')
		return $('select#employee').val();
	},
	getProjectEmployee: function(employee) {
		var result = Meteor.users.findOne({"_id": employee});

		// known as guarding (are we finding anything in the query)
		var firstName = result && result.profile && result.profile.firstName;
		var lastName = result && result.profile && result.profile.lastName;

		return (firstName + " " + lastName);
		// {{getProjectEmployee user._id}}
	},

	// returns all users
	users() {
		return Meteor.users.find({});
	},
	// evaluates for supervisors
	isSupervisor: function(position) {
		return ((position === 'Supervisor') || (position === 'Administrator'));
	},
	// finds and retrieves supervisor name
	getSupervisor: function(supervisor) {
		// search for supervisorID
		var result = Meteor.users.findOne({"_id": supervisor});

		// known as guarding (are we finding anything in the query)
		var firstName = result && result.profile && result.profile.firstName;
		var lastName = result && result.profile && result.profile.lastName;

		return (firstName + " " + lastName);
	},
	// returns selected for appropriate supervisor
	isEdit: function(userID) {
		var projectID = Session.get('selectedProjectID');

		if (projectID !== null) {
			var project = Projects.findOne(projectID);

				if (project.supervisor === userID) {
					return "selected";
				} else {
					return "";
				}
		}
	},
	// returns all employees within project in selectedProject Session.
	isEditEmployee: function(userID) {
		var projectID = Session.get('selectedProjectID');

		if (projectID !== null) {
			var project = Projects.findOne(projectID);

			for(index = 0; index < project.employees.length; index++)
			{
				if ((project.employees[index] === userID)) {
					return "selected";
				} 
			}
			return "";
		}
	},

	// returns appropriate text for edit/new
	isNew: function() {
		var projectID = Session.get('selectedProjectID');

		if (projectID === null) {
			return "Add New Project";
		} else {
			return "Update Project";
		}
	},
	isProjectSupervisor: function() {
		return Meteor.user().profile.position === 'Supervisor';
	},
	isEditable: function() {
		return (Meteor.user().profile.position === 'Supervisor' ? "disabled" : "");
	}
});

Template.newProject.events({
  'click #back': function(event){
  	event.preventDefault();

		// Clear form
		projectName.value = '';
		supervisor.value = '';
		client.value = '';
		budget.value = '';

		// close modal
		Modal.hide('newProject');
  },

  'click #clear': function(event){
    	event.preventDefault();
    
		// Clear form
		projectName.value = '';
		supervisor.value = '';
		client.value = '';
		budget.value = '';
  },

	'click #submit': function(event){
		// Prevent default browser behavior
		event.preventDefault();

		var projectID = Session.get('selectedProjectID');
		//var employeesNodeList = document.getElementsByClassName("employee");
		var employeeList = [];
		var employeesNodeList = $('#employee').val();

		//push form values for "_id" into new employeeList string array
		if (employeesNodeList !== null){
			for (index = 0; index < employeesNodeList.length; index++)	{
				employeeList.push(employeesNodeList[index]);
			}
		}
		
		
		employeeList.push($('#supervisor').val());

		let validEmployees = [];
		for (let i = 0; i < employeeList.length; i++) {
			if(validEmployees.indexOf(employeeList[i]) == -1) {
				validEmployees.push(employeeList[i]);
			}
		}

		// Get value from form element
		var project = {
			name: $('#projectName').val(),
			supervisor: $('#supervisor').val(),
			client: $('#client').val(),
			budget: $('#budget').val(),
			employees: validEmployees,
			//employees: employeeList, //insert selected values from box2
		
		}

		var checkProject = validateProject(project);
		if (checkProject) {
			return swal({
				title: "Error",
				text: checkProject,
				button: {
					text: "Confirm",
				},
				icon: "error"
			});
		}

		// if not in edit mode
		if (!projectID) {
				Meteor.call('insertProject', project, (error) => {
					if (error) {
						alert(error.error);
					} else {

						// success alert
						return swal({
						title: "Success",
						text: "New Project Added",
						button: {
							text: "Close",
						},
						icon: "success"
					});
					}
				});
		} 
		else {
			_.extend(project, {_id: projectID});
			Meteor.call('editProject', project, (error) => {
				if (error) {
					alert(error.error);
				} else {

					// success alert
					return swal({
					title: "Success",
					text: "Project Updated",
					button: {
						text: "Close",
					},
					icon: "success"
					});
				}
			});
		}

		// Clear form
		projectName.value = '';
		supervisor.value = '';
		client.value = '';
		budget.value = '';

		// dismiss modal
	  	Modal.hide('newProject');
	},
});