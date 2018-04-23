# MeteorProject
Tracking and Development of Student Web App

**[Live Preview](http://www.rurikid.com/meteor.html)**
--------------------------------------------

**Installation**
--------------------------------------------
```
> Install Meteor & NPM
> git clone https://github.com/rurikid/meteorproject
> cd meteorproject
> npm install --sweetalert
> meteor
```

**Important Reading**
--------------------------------------------

Documentation | Node.js | Tutorials 
-----------------------|---------|----------
[Application Structure](https://guide.meteor.com/structure.html) | [Handlebars.js](http://handlebarsjs.com/) | [Install Mongo](https://docs.mongodb.com/manual/administration/install-community/)
[Blaze Tutorial](http://blazejs.org/guide/introduction.html) | [Moment.js](http://momentjs.com/) | [Official Meteor Tutorial](https://www.meteor.com/tutorials/blaze/creating-an-app)
[SweetAlert Documentation](https://sweetalert.js.org/docs/) | [Meteor Modal Dialogs](https://experimentingwithcode.com/modal-dialogs-part-2/) | [Your First Meteor Application](http://meteortips.com/first-meteor-tutorial/)
[MongoDB Tutorial](https://www.tutorialspoint.com/mongodb/index.htm) | | [Your Second Meteor Application](http://meteortips.com/second-meteor-tutorial/)
[RegExr](https://regexr.com/) | | [Getting Started with Meteor](https://themeteorchef.com/tutorials/getting-started-with-meteor)

**TODO**
--------------------------------------------
```
> Improve Reports implementation
> Improve add/remove project member functionality
> Create Starting Database within startup/server/fixtures.js (EASY)(Required Use Case)
> Evaluate Functionality (EASY)(Would Be Nice)
> Improve Stylization (EASY)(Would Be Nice)
> Implement update password/email for users (HARD)(Would Be Nice)
> Implement sort for columns (HARD)(Would Be Nice)
```

**Patch Notes**
--------------------------------------------
**22Apr2018** - rurikid
```
> moved employee deletion upkeep management to serverside
> consolidated My Team into My Projects
> implemented collapsible tables for Timesheets/TeamTimesheets/Projects
> fixed issue which allowed supervisors to edit project details
> removed employee view for supervisors by popular demand
> reverted Meteor.user() attribute in timechunk collection
> removed deprecated files
```

**22Apr2018** - msylveus
```
> Added employee to timechunk database schema to display on Reports
> Added Employee name to reports table
> Show No data label when no timesheets availabe for a particular project
```

**21Apr2018** - msylveus
```
> Removing employee from projects, timesheets and timechunks when employee is deleted
```

**21Apr2018** - rurikid
```
> teamTimesheets are now fully functional for all required time frames (may need more testing)
> changed error message on adding timesheet
> fixed an issue with duplicate files
```

**20Apr2018** - msylveus
```
> administrator can view daily, weekly, monthly and date range reports
> supervisors can now see only the projects they are supervising on Team 
> Error handling for empty fields before generating report

```

**20Apr2018** - rurikid
```
> regular project members can now add timesheets
> demoted supervisors/admins now update project supervisors to ''
> began team timesheets page (currently shows all time chunks for all dates)
> employee's can now properly see their projects
> user's can now see their proper role in a project
> supervisors can now only edit projects they are supervising
> edit buttons no longer function if nothing is selected
> team timesheets now displays timechunks from former project members
```

+**20Apr2018** - mwight
```
+> fixed css for "add new member" button on team.html
+> removed auto-check from radio buttons on projects.html
+> "You are logged in as: _______" has been added (into nav.html)
+> Implemented functionality for "Your role" column on My Projects page
+> Validation for creating new projects and editing new projects is complete
```

**18Apr2018** - mwight
```
> Adding employees to new projects now implemented via multiselect
> Updating project employees now implemented via multiselect
> Validation for duplicates on editing and adding is complete
> note: No way to remove a name off second multselect element after being added besides unselecting them before 
    submit(only selected items on the second multiselector are sent to the db)
```


**18Apr2018** - rurikid
```
> timesheets now show number of hours worked per day and per timechunk
> completed timechunk overlap validation
> implemented previous and next week view functionality
> guarded access against logged out users
```

**17Apr2018** - msylveus
```
> uploaded style and code for team
```

**17Apr2018** - rurikid
```
> implemented timesheet view
> implemented timesheet edit and delete
> some stylization changes
> allowed sysadmin creation on startup at /startup/server/fixtures.js
> reverted to timechunk collections
> implemented timesheet user validation
```

**16Apr2018** - rurikid
```
> reworked how timesheets are stored; now contain a timechunks array, instead of using timechunks collection
> included Moment.js to help manage timesheet validation and rendering
> implemented timesheet validation
> implemented employee validation
> sorted TODO by necessity and difficulty
```

**15Apr2018** - mwight
```
> Implemented ability to dynamically add employees to a new project
> Correctly displays employees involved in projects on projects.html
> Beginning feature to existing employees in a project
```

**15Apr2018** - rurikid
```
> implemented timesheets and timechunks collection
> implemented add/edit modal dialogue for new timesheets
> started timesheet rendering (not yet tied to database)
> started user position logic for timesheets
```

**13Apr2018** - rurikid
```
> implemented update functionality for projects
> implemented update functionality for employees
> removed deprecated editEmployee/editProject files
> reworked how modals are called
> included bootstrap modals to meteor packages
> included sessions to meteor packages
> removed CDN calls to bootstrap
```

**12Apr2018** - rurikid
```
> implemented modal dialogues for adding new employee/project
> commented out search functions for employees and projects pages
> rearranged buttons and header for employees and projects pages
> added a left margin to the nav component
> dropped the profile page from navigation; simply not currently a priority
```

**11Apr2018** - rurikid
```
> implemented delete functionality to projects and employees
```

**09Apr2018** - rurikid
```
> hosted live version of the current build, manually updated
> fixed nav background
> called nav in remaining unimplemented locations
> removed 'Projects' option from nav and home
> introduced newEmployee css to newProject
> implemented projects.html
> added back and reset buttons to newEmployee and newProject
> added background image to home and fixed login background
> added user role logic to projects, employees, nav, and body
> removed some deprecated files
```

**06Apr2018** - mwight
```
> starter page for reports.html added
> reports tab on nav routes to starter page for reports.html
> Login.html css - done
> employees page populates tables
> edit/delete functionality still not functional
> basic css and nav component added to newemployee
> edits to main.css
```

**04Apr2018** - rurikid
```
> completed newEmployee integration w/ database 
> completed newProject integration w/ database
> introduced basic publications and tests
> set up basic employee and project query
```

**03Apr2018** - rurikid
```
> included list of useful reference material
```

**02Apr2018** - rurikid
```
> integrated style from msylveus into proper site file structure
> began consolidating myslveus's style into main.css
> created routes for all new pages and components
> implemented nav component for all pages
> created components for adding and editing employees/projects/members for future implementation
> began .js files for new pages for future use
> removed deprecated files
> login and logout functional
> newEmployee functional; needs further work
> added comments on each page detailing needed work
> added api/timesheets/Timesheets.js to hold Timesheets collection
> updated .meteor/packages to automatically include required packages
> updated Installation Guide to remove packages included in .meteor/packages
```

**02Apr2018** - mwight
```
> NOTE: edited the installation instructions 
         - I needed to include addition of flow-router and blaze-layout for full functionality
> Added Bootstrap via CDN(Content Delivery Network): Link coded to 'client/head.html'
> Reorganized file structure: Added Myrline's new html pages w/ subfolders to 'imports/ui/pages' 
> Cleaned up buttons code for nav.html
> Added routing events functions to nav.js 
> Added div class for navbar
> Added css to correct page format of navbar and form
```

**01Apr2018** - msylveus
```
> Uploaded general application style
```

**27Mar2018** - rurikid
```
> Reorganized file structure
> Basic routing implementation
> Database is operation
> Views are implemented depending on user
> Now possible to create users
```

**24Feb2018** - rurikid
```
> Added most pages required for prototyping.
> Still needs CSS and basic onClick() functionality for navigation
> None of the JS behavior has been implemented
> Currently working on Employee creation; it is most important
```

**Contact:**
rurikid@tutanota.com
