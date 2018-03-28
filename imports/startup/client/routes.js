import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/not-found/not-found.js';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home' });
  },
});

FlowRouter.route('/nav', {
  name: 'nav',
  action() {
    BlazeLayout.render('App_body', { main: 'nav' });
  },
});

FlowRouter.route('/createUser', {
  name: 'createUser',
  action() {
    BlazeLayout.render('App_body', { main: 'createUser' });
  },
});

FlowRouter.route('/login', {
  name: 'login',
  action() {
    BlazeLayout.render('App_body', { main: 'login' });
  },
});

FlowRouter.route('/timesheet', {
  name: 'timesheet',
  action() {
    BlazeLayout.render('App_body', { main: 'timesheet' });
  },
});

FlowRouter.route('/teamTimesheet', {
  name: 'teamTimesheet',
  action() {
    BlazeLayout.render('App_body', { main: 'teamTimesheet' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};
