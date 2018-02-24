import { Template } from 'meteor/templating';

import { Users } from '../api/Users.js';

import './createUser.js';
import './body.html';
import './login.html';
import './splash.html';
import './nav.html';
import './teamTimesheet.html';
import './timesheet.html'

Template.body.helpers({
  tasks: [
    { text: 'Task1' },
    { text: 'Task2' },
    { text: 'Task3' },
  ],
});