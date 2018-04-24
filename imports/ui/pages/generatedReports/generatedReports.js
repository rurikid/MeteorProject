import { Users } from '/imports/api/users/users.js';
import { Timesheets } from '/imports/api/timesheets/timesheets.js';
import { Timechunks } from '/imports/api/timechunks/timechunks.js';
import { Meteor } from 'meteor/meteor';
import '/imports/api/helpers/modal.js';
//import { Projects } from '../../../api/projects/projects.js';
import { Projects } from '/imports/api/projects/projects.js';
import  '../../../ui/pages/reports/reports.js';
import  '../../../ui/pages/timesheet/timesheets.js';

import './generatedReports.html';

//********Global variables*******
// array to hold keys in json object since json object are not sorted
var timeSheetKeyArray = [];

//array to hold keys in json object for timechunks
var timeChunkKeyArray = []; 

 //Holds data to be displayed
var timeChunkObject = {};

//Given a date and a format for the date, it will return a string with that format
function getStringDate(date, dateFormat) {
  return (moment(date).format(dateFormat));
}

//Getting the total for a list of timechunks
function getTotalHoursForTimeChunk(timeChunk) {
  var start = timeChunk.startTime.split(':');
  var end = timeChunk.endTime.split(':');
  var total = (Number(end[0]) * 60 + Number(end[1])) - (Number(start[0]) * 60 + Number(start[1]));
  return (total / 60);
}//end of getTotalHoursForTimeChunk

Template.generatedReports.onCreated( function () {
  console.log("Report Type", FlowRouter.getParam("reportType"));
  console.log("ProjectId", FlowRouter.getParam("projectId"));
  this.subscribe('projects.all');
  this.subscribe('users.all');
  this.subscribe('timesheets.all');
  this.subscribe('timechunks.all');

});

Template.generatedReports.onDestroyed( function() {
  //Resetting to empty
  timeSheetKeyArray = [];
 //timeSheetJson = {};
  timeChunkKeyArray = [];
  Session.set("showNoData", false);
});


Template.reportTimesheets.helpers({ 

      showNodata() {
        var nodataValue = Session.get("showNoData")
        return nodataValue;
      },

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
    var dateString = '';
    
    //consolidatedArray.push.apply(fectchResult);
    fectchResult.forEach(function (entry) {
        console.log("****inside for each****");
        var timechunks = Timechunks.find({$and:[{'timesheet': entry._id}, {'project': projectId}]}).fetch();
      
        if(FlowRouter.getParam("reportType") == "daily") {
          dateString = getStringDate(entry.date, 'dddd, MMMM Do YYYY');

        } else if (FlowRouter.getParam("reportType") == "weekly" || FlowRouter.getParam("reportType") == "date_range") {
          var curr = new Date(entry.date);
          var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
          var last = first + 6; // last day is the first day + 6
          var dateString = getStringDate(new Date(curr.setDate(first)), 'MMMM Do YYYY') + " - " +  getStringDate(new Date(curr.setDate(last)), 'MMMM Do YYYY');

        } else if(FlowRouter.getParam("reportType") == "monthly") {//Check if monthly
          var dateString = getStringDate(entry.date, 'MMMM YYYY');
        }
        
        timechunks.forEach(function (timechunck) {
          var key = timechunck.userInfo.userId + "-" + dateString;
          if(timeChunkObject[key] == null) {
            var timeChunkData = {};
            timeChunkData["name"] = (timechunck.userInfo.firstName + " " + timechunck.userInfo.lastName);
            timeChunkData["totalHours"] = getTotalHoursForTimeChunk(timechunck);
            timeChunkData["date"] = dateString;
            timeChunkObject[key] =  timeChunkData;
            
            timeChunkKeyArray.push(key);
          } else {
            /*
              we have a json that looks like this. 
              {
                "userId": {
                  "name": nameOfUserInTimeChunk,
                  "totalHours": total hours for a user in time chunk
                }
              }
            */
            
            //get the value from timeChunkObject
            var data = timeChunkObject[key]; 
            
            //get the totalhour from the value(data)
            var totalHours = data["totalHours"];
            
            //aggregate the existing hour with the new time chunk hour
            var concatHours = totalHours + getTotalHoursForTimeChunk(timechunck);
            
            // update the value object totalhours with aggreagated value
            data["totalHours"] = concatHours;

            //Set the upated value object back to timechunkObject
            timeChunkObject[key] = data;
          }
        });

         

        // if (Object.keys(timeChunkObject).length > 0) {
    
        //   if (FlowRouter.getParam("reportType") == "daily") {//Check if daily
        //     //Adding things to timeSheetJson, with date as key, and saving timechuncks and total hours
        //     if(timeSheetJson[dateString] == null) {
        //       timeSheetKeyArray.push(dateString);
        //       console.log("Adding to timesheet array", timeSheetKeyArray);
        //       timeSheetJson[dateString] = valueJson;
        //     }     
        //   } else if(FlowRouter.getParam("reportType") == "weekly" || FlowRouter.getParam("reportType") == "date_range") {//Check if weekly
        //       var curr = new Date(entry.date);
        //       var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        //       var last = first + 6; // last day is the first day + 6
      
        //       //getting first day and last day of week for a given date and saving it as key in dictionary
        //       var dateString = getStringDate(new Date(curr.setDate(first)), 'MMMM Do YYYY') + " - " +  getStringDate(new Date(curr.setDate(last)), 'MMMM Do YYYY')

        //       //checking to see if JSON already has the date string key
        //       if(timeSheetJson[dateString] == null) { //adding entry to json if key doesn't exist
        //         var valueJson = {};
        //         valueJson["timeChunks"] = timeChunkObject;
        //         timeSheetKeyArray.push(dateString);
        //         timeSheetJson[dateString] = valueJson;
        //     } 
        //   } else if(FlowRouter.getParam("reportType") == "monthly") {//Check if monthly
        //     var dateString = getStringDate(entry.date, 'MMMM YYYY');
          
        //     if(timeSheetJson[dateString] == null) {
        //       var valueJson = {};
        //       valueJson["timeChunks"] = timeChunkObject;

        //       timeSheetKeyArray.push(dateString);
        //       timeSheetJson[dateString] = valueJson;
              
        //     } 
        //   }//end of time period if-else statements

        // }//end of timeChunksArray length check if statement

    });//end of fetchResult forEach loop
    
      var showNodataValue = timeChunkKeyArray.length === 0;
      Session.set("showNoData", showNodataValue);


    return timeChunkKeyArray;

  },//end of timesheets()


  // returns all associated timechunks
  timechunks: function() {
    console.log("Time Chunk Key array", timeChunkKeyArray);
    return timeChunkKeyArray;
  },

  // finds and retrieves project name
  getProjectName: function(project) {
    // search for project
    var result = Projects.findOne({"_id": project});

    // known as guarding (are we finding anything in the query)
    var name = result && result.name;

    return result.name;
  },//end of getProjectName
 
  getTableHeaderTitle: function(key) {
    console.log("printing key", timeChunkKeyArray);
    console.log("printing timeChunkObject", timeChunkObject);
    return timeChunkObject[key].date;
  },

  getEmployeeName: function(key) {
    return timeChunkObject[key].name;
  },

  // returns number of hours worked in a timechunk
  getTimechunkHours: function(key) {
    return timeChunkObject[key].totalHours;
  },//end of getTimechunkHours

});