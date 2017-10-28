const express = require('express');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const issuesRouter = express.Router({ mergeParams: true });

issuesRouter.param('issueId', (req, res, next, issueId) => {
  db.get('SELECT * FROM Issue WHERE id = $id',
    {
      $id: issueId,
    },
    (error, row) => {
      if (!row) {
        res.status(404).send();
      } else {
        next();
      }
    });
});

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

issuesRouter.post('/', (req, res, next) => {
  const newIssue = req.body && req.body.issue;
  if (newIssue && newIssue.name && newIssue.issueNumber
    && newIssue.publicationDate && newIssue.artistId) {
    db.run('INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ($name, $issueNumber, $publicationDate, $artistId, $seriesId)',
      {
        $name: newIssue.name,
        $issueNumber: newIssue.issueNumber,
        $publicationDate: newIssue.publicationDate,
        $artistId: newIssue.artistId,
        $seriesId: newIssue.seriesId || req.params.seriesId,
      },
      function () {
        db.get('SELECT * FROM Issue WHERE id = $id',
          {
            $id: this.lastID,
          }, (error, row) => {
            res.status(201).send({ issue: row });
            next();
          });
      });
  } else {
    res.status(400).send();
  }
});

issuesRouter.put('/:issueId', (req, res, next) => {
  const id = req.params.issueId;
  const newIssue = req.body && req.body.issue;
  if (newIssue && newIssue.name && newIssue.issueNumber
      && newIssue.publicationDate && newIssue.artistId) {
    db.run('UPDATE Issue SET name = $name, issue_number = $issueNumber, publication_date = $publicationDate, artist_id = $artistId, series_id = $seriesId WHERE id = $id',
      {
        $id: id,
        $name: newIssue.name,
        $issueNumber: newIssue.issueNumber,
        $publicationDate: newIssue.publicationDate,
        $artistId: newIssue.artistId,
        $seriesId: newIssue.seriesId || req.params.seriesId,
      },
      () => {
        db.get('SELECT * FROM Issue WHERE id = $id',
          {
            $id: id,
          }, (error, row) => {
            res.status(200).send({ issue: row });
            next();
          });
      });
  } else {
    res.status(400).send();
  }
});

issuesRouter.delete('/:issueId', (req, res, next) => {
  const id = req.params.issueId;
  db.run('DELETE FROM Issue WHERE id = $id',
    {
      $id: id,
    },
    () => {
      res.status(204).send();
      next();
    });
});


module.exports = issuesRouter;
