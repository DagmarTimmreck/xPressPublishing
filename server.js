const Express = require('express');
const bodyParser = require('body-parser-json');
const morgan = require('morgan');
const sqlite3 = require('sqlite3');

const app = new Express();
module.exports = app;

const PORT = process.env.PORT || 4001;

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// automatically parse json body to req.body
app.use(bodyParser.json());

// logging with dev infos
app.use(morgan('dev'));

// serve static content from folder 'public'
app.use(Express.static('public'));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
