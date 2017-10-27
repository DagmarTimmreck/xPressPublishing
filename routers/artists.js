const express = require('express');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const artistsRouter = express.Router();

artistsRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Artist WHERE is_currently_employed = 1',
    (error, rows) => {
      res.status(200).send({ artists: rows });
      next();
    });
});

artistsRouter.post('/', (req, res, next) => {
  const newArtist = req.body && req.body.artist;
  if (newArtist && newArtist.name && newArtist.dateOfBirth && newArtist.biography) {
    db.run('INSERT INTO Artist (name, date_of_birth, biography) VALUES ($name, $dateOfBirth, $biography)',
      {
        $name: newArtist.name,
        $dateOfBirth: newArtist.dateOfBirth,
        $biography: newArtist.biography,
      },
      function () {
        db.get('SELECT * FROM Artist WHERE id = $id',
          {
            $id: this.lastID,
          }, (error, row) => {
            res.status(201).send({ artist: row });
            next();
          });
      });
  } else {
    res.status(400).send();
  }
});

artistsRouter.get('/:artistId', (req, res, next) => {
  const id = req.params.artistId;
  db.get('SELECT * FROM Artist WHERE id = $id',
    {
      $id: id,
    }, (error, row) => {
      if (row) {
        res.status(200).send({ artist: row });
      }
      next();
    });
});

artistsRouter.put('/:artistId', (req, res, next) => {
  const id = req.params.artistId;
  const newArtist = req.body && req.body.artist;
  if (newArtist && newArtist.name && newArtist.dateOfBirth && newArtist.biography) {
    db.run('UPDATE Artist SET name = $name, date_of_birth = $dateOfBirth, biography = $biography WHERE id = $id',
      {
        $id: id,
        $name: newArtist.name,
        $dateOfBirth: newArtist.dateOfBirth,
        $biography: newArtist.biography,
      },
      function () {
        db.get('SELECT * FROM Artist WHERE id = $id',
          {
            $id: id,
          }, (error, row) => {
            res.status(200).send({ artist: row });
            next();
          });
      });
  } else {
    res.status(400).send();
  }
});

artistsRouter.delete('/:artistId', (req, res, next) => {
  const id = req.params.artistId;
  db.run('UPDATE Artist SET is_currently_employed = 0 WHERE id = $id',
    {
      $id: id,
    },
    function () {
      db.get('SELECT * FROM Artist WHERE id = $id',
        {
          $id: id,
        }, (error, row) => {
          res.status(200).send({ artist: row });
          next();
        });
    });
});

module.exports = artistsRouter;
