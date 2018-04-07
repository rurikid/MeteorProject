import { Users } from '../../../api/users/users.js';
import { Projects } from '../../../api/projects/projects.js';

import './home.html';

import '../../components/nav/nav.js';
import '../../components/newEmployee/newEmployee.js';
import '../../components/newProject/newProject.js';
import '../../components/editProject/editProject.js';
import '../../components/newMember/newMember.js';
import '../../components/editTimesheet/editTimesheet.js';

import '../login/login.js';
import '../teamTimesheet/teamTimesheet.js';
import '../timesheet/timesheet.js';
import '../profile/profile.js';
import '../projects/projects.js';
import '../team/team.js';
import '../employees/employees.js';
import '../reports/reports.js';

Template.home.events({
  'click .logout': function(event){
    event.preventDefault();
    Meteor.logout();
    FlowRouter.go('/login');
  },
  'click .login': function(event){
    event.preventDefault();
    FlowRouter.go('/login');
  },
  'click .profile': function(event){
    event.preventDefault();
    FlowRouter.go('/profile');
  },
  'click .projects': function(event){
    event.preventDefault();
    FlowRouter.go('/projects');
  },
  'click .timesheet': function(event){
    event.preventDefault();
    FlowRouter.go('/timesheet');
  },
  'click .team': function(event){
    event.preventDefault();
    FlowRouter.go('/team');
  },
  'click .teamTimesheet': function(event){
    event.preventDefault();
    FlowRouter.go('/teamTimesheet');
  },
  'click .reports': function(event){
    event.preventDefault();
    FlowRouter.go('/reports');
  },
  'click .employees': function(event){
    event.preventDefault();
    FlowRouter.go('/employees');
  }
});