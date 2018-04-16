import { Users } from '../../../api/users/users.js';
// import { Timesheets } from '../../api/timesheets.js'

import './timesheets.html';

Template.timesheets.events({
	// not yet implemented
  // 'click .deleteTimesheet'(event) {
  //   // Prevent default browser behavior
  //   event.preventDefault();

  //   // Get value from form element
  //   const ids = document.getElementsByName('projectID');
  //   var id;
  //   for (i = 0; i < ids.length; i++) {
  //     if (ids[i].checked){
  //       id = ids[i].value; 
  //     }
  //   }

  //   Meteor.call('deleteTimesheet', id, (error) => {
  //     if (error) {
  //       alert(error.error);
  //     } else {

  //       // success alert
  //       return swal({
  //         title: "Removed!",
  //         text: "Timesheet Removed",
  //         button: {
  //           text: "Close",
  //         },
  //         icon: "success"
  //       });
  //     }
  //   });
  // },

  'click .newTimesheet'(event) {
  	// Prevent default browser behavior
  	event.preventDefault();
    Meteor.call('editTimesheetModal', null);
  },

  'click .editTimesheet'(event) {
  	// Prevent default browser behavior
  	event.preventDefault();

  	// not yet implemented
  	// get value from form element
  	// const ids = document.getElementsByName('projectID');
  	var id;
  	// for (i = 0; i < ids.length; i++) {
  	// 	if (ids[i].checked){
  	// 		id = ids[i].value;
  	// 	}
  	// }

    Meteor.call('editTimesheetModal', id);
  },
});