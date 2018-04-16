// Tests for the projects publications
//
// https://guide.meteor.com/testing.html

import { assert } from 'chai';
import { Timesheets } from '../timesheets.js';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publications.js';

// describe('projects publications', function () {
//   beforeEach(function () {
//     Projects.remove({});
//     Projects.insert({
//       name: 'FireBird',
//       supervisor: 'Rurikid',
//       client: 'Varangian Studios',
//       budget: 1000000,
//     });
//   });

//   describe('projects.all', function () {
//     it('sends all projects', function (done) {
//       const collector = new PublicationCollector();
//       collector.collect('projects.all', (collections) => {
//         assert.equal(collections.projects.length, 1);
//         done();
//       });
//     });
//   });
// });