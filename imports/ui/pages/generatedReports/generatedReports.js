import { Users } from '/imports/api/users/users.js';
import { Timesheets } from '/imports/api/timesheets/timesheets.js';
import { Timechunks } from '/imports/api/timechunks/timechunks.js';
import { Meteor } from 'meteor/meteor';
import '/imports/api/helpers/modal.js';
import { Projects } from '../../../api/projects/projects.js'

import  '../../../ui/pages/reports/reports.js'
import  '../../../ui/pages/timesheet/timesheets.js'

import './generatedReports.html';

//Global variables
var timeSheetKeyArray = []; // array to hold keys in json object since json object are not sorted
var timeSheetJson = {}; //Holds data to be displayed

//Given a date and a format for the date, it will return a string with that format
function getStringDate(date, dateFormat) {
  return (moment(date).format(dateFormat));
}

//Getting the total for a list of timechunks
function getTotalHoursForTimeChunks(timeChunksArray) {

  var hours = 0;

  //Looping through timechuncks to get the total hours
  timeChunksArray.forEach(function (doc) {
    var start = doc.startTime.split(':');
    var end = doc.endTime.split(':');

    var total = (Number(end[0]) * 60 + Number(end[1])) - (Number(start[0]) * 60 + Number(start[1]));

    hours = hours + (total / 60);

  }, function(error) {
    alert(error.error);
  })
  return hours;
}//end of getTotalHoursForTimeChunks

Template.generatedReports.onCreated( function () {
  
  console.log("Report Type", FlowRouter.getParam("reportType"));
  console.log("ProjectId", FlowRouter.getParam("projectId"));
  Meteor.subscribe('projects.all');
  Meteor.subscribe('users.all');
  Meteor.subscribe('timesheets.all');
  Meteor.subscribe('timechunks.all');

});

Template.generatedReports.onDestroyed( function() {
  //Resetting to empty
  timeSheetKeyArray = [];
  timeSheetJson = {};
});


Template.reportTimesheets.helpers({ 
    //Display time period selected
    getTimePeriod() {
      var param = FlowRouter.getParam("reportType");

      if(param == "daily") {
        return "Daily Timesheet Report";
      } else if (param == "weekly") {
        return "Weekly Timesheet Report";
      } else if (param == "monthly") {
        return "Monthly Timesheet Report";
      } else if (param == "date_range") {
        return "Timesheet Report";
      }
    },

    getRangeTimePeriod() {
      var param = FlowRouter.getParam("reportType");
      // var dateString = getStringDate(entry.date, 'dddd, MMMM Do YYYY');

      if (param == "date_range") {
        var from = FlowRouter.getParam("from");
        var to = FlowRouter.getParam("to");
        return getStringDate(from, 'MM/DD/YYYY') + " - " + getStringDate(to, 'MM/DD/YYYY');
      } 
    },

    // finds and retrieves supervisor/admin name
    getUsersName: function() {
      return (Meteor.user().profile.firstName + " " + Meteor.user().profile.lastName);
    },

    // returns all user timesheets
    timesheets() {
      var from = FlowRouter.getParam("from");
      var to = FlowRouter.getParam("to");
      var projectId = FlowRouter.getParam("projectId");
      var timesheets = [];
      var result = null;

      //if it's date range, making sure query reflects the range
      if (from == null || to == null) {
        result = Timesheets.find();
      } else {
        result = Timesheets.find({
          $and:[
            {'date': {$gte: from}}, 
            {'date': {$lte: to}}
        ]});
      }//end of date range if-else statement
    
    
    var fectchResult = result.fetch();
    

    //consolidatedArray.push.apply(fectchResult);
    fectchResult.forEach(function (entry) {
      var timechunks = Timechunks.find({$and:[{'timesheet': entry._id}, {'project': projectId}]}).fetch();
      
      var timeChunksArray = [];

      timechunks.forEach(function (timeChunk) {
        timeChunksArray.push(timeChunk);
      });

        if (timeChunksArray.length > 0) {
          var totalHours = getTotalHoursForTimeChunks(timeChunksArray);
      
     
          if (FlowRouter.getParam("reportType") == "daily") {//Check if daily

            var dateString = getStringDate(entry.date, 'dddd, MMMM Do YYYY');
    
            var valueJson = {};
            valueJson["timeChunks"] = timeChunksArray;
            valueJson["totalHours"] = totalHours;
    
            //Adding things to timeSheetJson, with date as key, and saving timechuncks and total hours
            if(timeSheetJson[dateString] == null) {
              timeSheetKeyArray.push(dateString);
              timeSheetJson[dateString] = valueJson;
            } 
    
          } else if(FlowRouter.getParam("reportType") == "weekly" || FlowRouter.getParam("reportType") == "date_range") {//Check if weekly
            var curr = new Date(entry.date);
            var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
            var last = first + 6; // last day is the first day + 6
    
            //getting first day and last day of week for a given date and saving it as key in dictionary
            var dateString = getStringDate(new Date(curr.setDate(first)), 'MMMM Do YYYY') + " - " +  getStringDate(new Date(curr.setDate(last)), 'MMMM Do YYYY')

            //checking to see if JSON already has the date string key
            if(timeSheetJson[dateString] == null) { //adding entry to json if key doesn't exist
              var valueJson = {};
              valueJson["timeChunks"] = timeChunksArray;
    
              valueJson["totalHours"] = totalHours;

              timeSheetKeyArray.push(dateString);

              timeSheetJson[dateString] = valueJson;
            } else { //updating the value for that key if it exist

              var array = timeSheetJson[dateString]["timeChunks"];
              
              var concatArray = array.concat(timeChunksArray);
              
              //taking existing total hours from json and adding new totalHours for a timechunck
              var concatHours = timeSheetJson[dateString]["totalHours"] + totalHours;

              timeSheetJson[dateString]["timeChunks"] = concatArray;
              timeSheetJson[dateString]["totalHours"] = concatHours;
            }
    
          } else if(FlowRouter.getParam("reportType") == "monthly") {//Check if monthly
            var dateString = getStringDate(entry.date, 'MMMM YYYY');
          
            if(timeSheetJson[dateString] == null) {
              var valueJson = {};
              valueJson["timeChunks"] = timeChunksArray;
    
              valueJson["totalHours"] = totalHours;

              timeSheetKeyArray.push(dateString);
              timeSheetJson[dateString] = valueJson;
              
            } else {
              var array = timeSheetJson[dateString]["timeChunks"];
              
              var concatArray = array.concat(timeChunksArray);
              
              var concatHours = timeSheetJson[dateString]["totalHours"] + totalHours;

              timeSheetJson[dateString]["timeChunks"] = concatArray;
              timeSheetJson[dateString]["totalHours"] = concatHours;
            }
          }//end of time period if-else statements

        }//end of timeChunksArray length check if statement

    });//end of fetchResult forEach loop
    
    return timeSheetKeyArray;

  },//end of timesheets()

  //Getting total hours for a timesheet
  timeSheetTotalHours: function(key) {
    
    return timeSheetJson[key].totalHours;
  },

  // returns all associated timechunks
  timechunks: function(key) {
    var timechunk =  timeSheetJson[key].timeChunks;
    return timeSheetJson[key].timeChunks;
  },

  // finds and retrieves project name
  getProjectName: function(project) {
    // search for project
    var result = Projects.findOne({"_id": project});

    // known as guarding (are we finding anything in the query)
    var name = result && result.name;

    return result.name;
  },//end of getProjectName
 
  // returns number of hours worked in a timechunk
  getTimechunkHours: function(startTime, endTime) {
    var start = startTime.split(':');
    var end = endTime.split(':');

    var total = (Number(end[0]) * 60 + Number(end[1])) - (Number(start[0]) * 60 + Number(start[1]));

    return total / 60;
  },//end of getTimechunkHours

});
