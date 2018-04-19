import { Users } from '/imports/api/users/users.js';
import { Timesheets } from '/imports/api/timesheets/timesheets.js';
import { Timechunks } from '/imports/api/timechunks/timechunks.js';
import { Meteor } from 'meteor/meteor';
import '/imports/api/helpers/modal.js';
import { Projects } from '../../../api/projects/projects.js'

//MS ADDED--------------
import  '../../../ui/pages/reports/reports.js'


import './generatedReports.html';

Template.generatedReports.onCreated( function () {
    console.log("On Rendered Params",FlowRouter.getParam("reportType"));
});


Template.generatedReports.events({

        'click #back': function(event){
          event.preventDefault();
              //$('#editProjectModal').modal('hide');
        },
});