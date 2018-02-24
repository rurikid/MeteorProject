import { Mongo } from 'meteor/mongo';
 
export const Users = new Mongo.Collection('Users');

Meteor.methods({
  'createUser.insert'(newFirstName, newLastName, newPosition, newUserID, newPassword, newSalary, newPayData) {
    
    Users.insert({
      firstName: newFirstName,
      lastName: newLastName,
      position: newPosition,
      userID: newUserID,
      password: newPassword,
      salary: newSalary,
      payData: newPayData,
      // timesheet: new Timesheet(),
    });
  },
});