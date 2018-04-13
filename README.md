# MeteorProject
Tracking and Development of Student Web App

**[Live Preview](http://www.rurikid.com/meteor.html)**

**Installation**
```
> Install Meteor & NPM
> git clone https://github.com/rurikid/meteorproject
> cd meteorproject
> npm install --sweetalert
> meteor
```

**Important Reading**

[Install Mongo](https://docs.mongodb.com/manual/administration/install-community/)

[MongoDB Tutorial](https://www.tutorialspoint.com/mongodb/index.htm)

[Blaze Tutorial](http://blazejs.org/guide/introduction.html)

[Application Structure](https://guide.meteor.com/structure.html)

[Official Meteor Tutorial](https://www.meteor.com/tutorials/blaze/creating-an-app)

[Getting Started with Meteor](https://themeteorchef.com/tutorials/getting-started-with-meteor)

[Your First Meteor Application](http://meteortips.com/first-meteor-tutorial/)

[Your Second Meteor Application](http://meteortips.com/second-meteor-tutorial/)

[SweetAlert Documentation](https://sweetalert.js.org/docs/)

[Meteor Modal Dialogs](https://experimentingwithcode.com/modal-dialogs-part-2/)

**Notes**
```
> To access unimplemented components
> localhost:3000/templateName
```

**TODO**
```
> Handlebar Guarding Against Logged Out Users & Wrong Roles
> Implement Timesheets Collection
> Implement Timesheet Management and Rendering
> Improve Stylization
> Implement Add Member to Project
> Design Report View
> Implement update password/email for users
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
