const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// Get all books
router.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool.query(queryText).then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
    .catch(error => {
      console.log('error getting books', error);
      res.sendStatus(500);
    });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post('/', (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;
  pool.query(queryText, [newBook.author, newBook.title])
    .then(result => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status
router.put('/:id', (req, res) => {
  console.log(req.body);
  let reqId = req.params.id;

  // change to read will come from the request body
  let readId = req.body.readId;
  let sqlText = '';

  // Logic for body of request...
  if (readId) {
      sqlText = `UPDATE "books" SET "isRead"='read' WHERE "id"=$1`;
  // Send the request to the DB...
  // Since we're only using 1 query parameter, we only have
  // one object in our array.
  }
  pool.query(sqlText, [readId]).then((resDB) => {
      // console.log(resDB); // just to verify the result is received.
      res.sendStatus(200); // server must always send a response.
  }).catch((error) => {
      // console.log(error);
      res.sendStatus(500);
  })
});

// TODO - DELETE 
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
router.delete('/:id', (req, res) => {
  let reqId = req.params.id;
  console.log('delete request for id', reqId);

  let sqlText = 'DELETE FROM "books" WHERE id=$1;';
  pool.query(sqlText, [reqId])
    .then((result) => {
      console.log('song deleted');
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(`error making database query ${sqlText}`, error);
      res.sendStatus(500);
    });
});

module.exports = router;
