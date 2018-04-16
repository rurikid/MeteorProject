import { Projects } from '/imports/api/projects/projects.js';
import { Users } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';
import './newProject.html';

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
				employee:'',
			}
		}

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
	isNew: function() {
		var projectID = Session.get('selectedProjectID');

		if (projectID === null) {
			return "Add New Project";
		} else {
			return "Update Project";
		}
	},
	//dynamic employee add


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

	'click #submit'(event){
		// Prevent default browser form submit
		event.preventDefault();

		var projectID = Session.get('selectedProjectID');
		var employeesNodeList = document.getElementsByClassName("employee");
		var employeeList = [];
		for(index = 0; index < employeesNodeList.length; index++)
		{
			employeeList.push(employeesNodeList[index].value);
			console.log(employeeList[index]);
		}

		console.log("employeeList:");
		console.log(employeeList);

		


		// Get value from form element
    var project = {
      name: $('#projectName').val(),
      supervisor: $('#supervisor').val(),
      client: $('#client').val(),
	  budget: $('#budget').val(),
	  //add functionality for multiple employee values dynamically here
      employees: employeeList,//$('#employee').val(),
	  //
    }

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
		} else {
			_.extend(project, {id: projectID});
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

	//adds new dropdown menu on click of '+'
	'click .add_employee_field':function(users) {
		event.preventDefault;

		var userList = Meteor.users.find({}).fetch();
 
		var wrapper = $(".employee_container");
		var html = '';
		html += '<div><select id="employee" class="employee">';

		//for each user in users
		for (index = 0 ;index < userList.length; index++ )
		{
			var userFirstName = userList[index].profile.firstName;
			var userLastName = userList[index].profile.lastName;
			var userID = userList[index]._id;
			
			//append select id to reflect index Number
			//html += '<div><select id="employee' + index + '">';

			//if not a supervisor/admin
			if(!(userList[index].profile.position == 'Supervisor') || !(userList[index].profile.position == 'Administrator' ))
			{
				
				html +='<option value="'+ userID + '">';
				html += userFirstName + ' ' + userLastName;
				html +='</option>';
				//console.log(userList[index].profile.position);
			}
			
		}
		html += '</select><a href="#" class="delete">Delete</a></div>';
		$(wrapper).append(html);
		console.log (html);

		$(wrapper).on("click", ".delete", function(e){
			e.preventDefault();
			$(this).parent('div').remove();
		})
	},
});