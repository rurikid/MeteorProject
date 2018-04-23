import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/not-found/not-found.js';

// Set up all routes in the app
// New routes follow the same pattern
FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('mainLayout', { main: 'home' });
  },
});

FlowRouter.route('/nav', {
  name: 'nav',
  action() {
    BlazeLayout.render('mainLayout', { main: 'nav' });
  },
});

FlowRouter.route('/employees', {
  name: 'employees',
  action() {
    BlazeLayout.render('mainLayout', { main: 'employees' });
  },
});

FlowRouter.route('/newEmployee', {
  name: 'newEmployee',
  action() {
    BlazeLayout.render('mainLayout', { main: 'newEmployee' });
  },
});

FlowRouter.route('/login', {
  name: 'login',
  action() {
    BlazeLayout.render('mainLayout', { main: 'login' });
  },
});

FlowRouter.route('/timesheets', {
  name: 'timesheets',
  action() {
    BlazeLayout.render('mainLayout', { main: 'timesheets' });
  },
});

FlowRouter.route('/newTimesheet', {
  name: 'newTimesheet',
  action() {
    BlazeLayout.render('mainLayout', { main: 'newTimesheet' });
  },
});

FlowRouter.route('/teamTimesheets', {
  name: 'teamTimesheets',
  action() {
    BlazeLayout.render('mainLayout', { main: 'teamTimesheets' });
  },
});

FlowRouter.route('/profile', {
  name: 'profile',
  action() {
    BlazeLayout.render('mainLayout', { main: 'profile' });
  },
});

FlowRouter.route('/projects', {
  name: 'projects',
  action() {
    BlazeLayout.render('mainLayout', { main: 'projects' });
  },
});

FlowRouter.route('/newMember', {
  name: 'newMember',
  action() {
    BlazeLayout.render('mainLayout', { main: 'newMember' });
  },
});

FlowRouter.route('/newProject', {
  name: 'newProject',
  action() {
    BlazeLayout.render('mainLayout', { main: 'newProject' });
  },
});

FlowRouter.route('/reports', {
  name: 'reports',
  action: function (params, queryParams) {
    BlazeLayout.render('mainLayout', { main: 'reports' });
  },
});

//Post report selections
FlowRouter.route('/generatedReports/:reportType/:projectId', {
  name: 'generatedReports',
  action() {
    BlazeLayout.render('mainLayout', { 
      main: 'generatedReports', 
    });
  },
});

FlowRouter.route('/generatedReports/:reportType/:projectId/:from/:to', {
  name: 'generatedReports',
  action() {
    BlazeLayout.render('mainLayout', { 
      main: 'generatedReports', 
    });
  },
});

FlowRouter.route('/team', {
  name: 'team',
  action() {
    BlazeLayout.render('mainLayout', { main: 'team' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('mainLayout', { main: 'App_notFound' });
  },
};