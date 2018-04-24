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
  this.subscribe('projects.all');
  this.subscribe('users.all');
  this.subscribe('timesheets.all');
  this.subscribe('timechunks.all');

});

Template.generatedReports.onDestroyed( function() {
  //Resetting to empty
  timeSheetKeyArray = [];
  timeChunkObject = {};
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
          var key =  dateString;
          var userId = timechunck.userInfo["userId"];
          console.log("Printng userId----*****", userId);
          if(timeChunkObject[key] == null) {
            
            var timeChunkData = {};
            timeChunkData["name"] = (timechunck.userInfo.firstName + " " + timechunck.userInfo.lastName);
            timeChunkData["totalHours"] = getTotalHoursForTimeChunk(timechunck);
            timeChunkData["date"] = dateString;

            var userObj = {};
            userObj[userId] = timeChunkData;

            /*
              monday: {
                userId: {}
                userId2: {}
                userId3 : {}
              }

            */
            timeChunkObject[key] =  userObj;
            timeChunkKeyArray.push(key);
            //console.log("Adding to array key", timeChunkObject);
              
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
            
           if(timeChunkObject[dateString][userId] == null) {
            
             console.log("printing else oj",timeChunkObject[dateString]);
             

              console.log("tcObj before", timeChunkObject);
              var timeChunkData = {};
              timeChunkData["name"] = (timechunck.userInfo.firstName + " " + timechunck.userInfo.lastName);
              timeChunkData["totalHours"] = getTotalHoursForTimeChunk(timechunck);
              timeChunkData["date"] = dateString;

              var data = timeChunkObject[dateString];
              data[userId] = timeChunkData;
              timeChunkObject[dateString] = data;
             

           } else {
            console.log("tcObj", timeChunkObject);

              //get the value from timeChunkObject
              var data = timeChunkObject[key][userId]; 
              
              // if(data["userId"] === userId) {

              // } else {

              // }
              //get the totalhour from the value(data)
              var totalHours = data["totalHours"];
              
              //aggregate the existing hour with the new time chunk hour
              var concatHours = totalHours + getTotalHoursForTimeChunk(timechunck);
              
              // update the value object totalhours with aggreagated value
              data["totalHours"] = concatHours;

              //Set the upated value object back to timechunkObject
              timeChunkObject[key][userId] = data;
           }

           console.log("PRINTING DATA", timeChunkObject);
            
          }
        });

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
    var projectId = FlowRouter.getParam("projectId");

    // search for project
    var result = Projects.findOne({"_id": projectId});

    // known as guarding (are we finding anything in the query)
    var name = result && result.name;

    return result.name;
  },//end of getProjectName
 
  timechunks: function(key) {
    
    var valueArray = [];
    for (var objKey in timeChunkObject[key]) {
      //console.log("objKey",timeChunkObject[key][objKey]);
      //if (timeChunkObject.hasOwnProperty(objKey)) {
        valueArray.push(timeChunkObject[key][objKey]);
     // }
    }

    console.log("printing timeChunkObject", valueArray);
    return valueArray;
  },

  getTableHeaderTitle: function(key) {
    
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