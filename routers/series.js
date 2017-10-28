const express = require('express');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const seriesRouter = express.Router();

const issuesRouter = require('./issues.js');

seriesRouter.param('seriesId', (req, res, next, id) => {
  db.get('SELECT * FROM Series WHERE id = $id',
    {
      $id: id,
    }, (error, row) => {
      if (row) {
        req.series = row;
        next();
      } else {
        res.status(404).send();
      }
    });
});

seriesRouter.use('/:seriesId/issues', issuesRouter);

seriesRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Series',
    (error, rows) => {
      res.status(200).send({ series: rows });
      next();
    });
});

seriesRouter.post('/', (req, res, next) => {
  const newSeries = req.body && req.body.series;
  if (newSeries && newSeries.name && newSeries.description) {
    db.run('INSERT INTO Series (name, description) VALUES ($name, $description)',
      {
        $name: newSeries.name,
        $description: newSeries.description,
      },
      function () {
        db.get('SELECT * FROM Series WHERE id = $id',
          {
            $id: this.lastID,
          }, (error, row) => {
            res.status(201).send({ series: row });
            next();
          });
      });
  } else {
    res.status(400).send();
  }
});

seriesRouter.get('/:seriesId', (req, res, next) => {
  res.status(200).send({ series: req.series });
  next();
});

seriesRouter.put('/:seriesId', (req, res, next) => {
  const id = req.params.seriesId;
  const newSeries = req.body && req.body.series;
  if (newSeries && newSeries.name && newSeries.description) {
    db.run('UPDATE Series SET name = $name, description = $description WHERE id = $id',
      {
        $id: id,
        $name: newSeries.name,
        $description: newSeries.description,
      },
      function () {
        db.get('SELECT * FROM Series WHERE id = $id',
          {
            $id: id,
          }, (error, row) => {
            res.status(200).send({ series: row });
            next();
          });
      });
  } else {
    res.status(400).send();
  }
});

seriesRouter.delete('/:seriesId', (req, res, next) => {
  const id = req.params.seriesId;
  db.run('DELETE FROM Series WHERE id = $id',
    {
      $id: id,
    },
    (error) => {
      res.status(204).send();
      next();
    });
});


module.exports = seriesRouter;
