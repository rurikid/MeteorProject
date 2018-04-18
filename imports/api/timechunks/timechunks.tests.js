// Tests for the behavior of the timechunks collection
//
// https://guide.meteor.com/testing.html

import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { Timechunks } from './timechunks.js';

// if (Meteor.isServer) {
//   describe('projects collection', function () {
//     it('insert correctly', function () {
//       const projectID = Projects.insert({
//         name: 'FireBird',
//         supervisor: 'Rurikid',
//         client: 'Varangian Studios',
//         budget: 1000000,
//       });
//       const added = Projects.find({ _id: projectID });
//       const collectionName = added._getCollectionName();
//       const count = added.count();

//       assert.equal(collectionName, 'projects');
//       assert.equal(count, 1);
//     });
//   });
// }