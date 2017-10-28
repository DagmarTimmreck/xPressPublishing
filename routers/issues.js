const express = require('express');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const issuesRouter = express.Router({ mergeParams: true });

issuesRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Issue WHERE series_id = $seriesId',
    {
      $seriesId: req.params.seriesId,
    },
    (error, rows) => {
      if (rows) {
        res.status(200).send({ issues: rows });
      }
      next();
    });
});

// issuesRouter.post('/', (req, res, next) => {
//   const newIssue = req.body && req.issue;
//   if (newIssue && newIssue.name && newIssue.description) {
//     db.run('INSERT INTO Issue (name, description) VALUES ($name, $description)',
//       {
//         $name: newIssue.name,
//         $description: newIssue.description,
//       },
//       function () {
//         db.get('SELECT * FROM Issue WHERE id = $id',
//           {
//             $id: this.lastID,
//           }, (error, row) => {
//             res.status(201).send({ issue: row });
//             next();
//           });
//       });
//   } else {
//     res.status(400).send();
//   }
// });

// issuesRouter.get('/:issuesId', (req, res, next) => {
//   const id = req.params.issuesId;
//   db.get('SELECT * FROM Issue WHERE id = $id',
//     {
//       $id: id,
//     }, (error, row) => {
//       if (row) {
//         res.status(200).send({ issue: row });
//       }
//       next();
//     });
// });

// issuesRouter.put('/:issuesId', (req, res, next) => {
//   const id = req.params.issuesId;
//   const newIssue = req.body && req.issue;
//   if (newIssue && newIssue.name && newIssue.description) {
//     db.run('UPDATE Issue SET name = $name, description = $description WHERE id = $id',
//       {
//         $id: id,
//         $name: newIssue.name,
//         $description: newIssue.description,
//       },
//       function () {
//         db.get('SELECT * FROM Issue WHERE id = $id',
//           {
//             $id: id,
//           }, (error, row) => {
//             res.status(200).send({ issue: row });
//             next();
//           });
//       });
//   } else {
//     res.status(400).send();
//   }
// });

// issuesRouter.delete('/:issuesId', (req, res, next) => {
//   const id = req.params.issuesId;
//   db.run('DELETE FROM Issue WHERE id = $id',
//     {
//       $id: id,
//     },
//     (error) => {
//       res.status(204).send();
//       next();
//     });
// });


module.exports = issuesRouter;
