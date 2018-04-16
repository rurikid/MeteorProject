// Definition of the projects collection

import { Mongo } from 'meteor/mongo';
 
export const Timesheets = new Mongo.Collection('timesheets');
export const Timechunks = new Mongo.Collection('timechunks');