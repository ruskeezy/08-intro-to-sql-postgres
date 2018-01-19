'use strict';

const fs = require('fs');
const express = require('express');

const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const app = express();
const conString = 'postgres://localhost:5432/testerdb'


const pg = require('pg');
const client = new pg.Client(conString);
// REVIEW: Use the client object to connect to our DB.
client.connect();


// REVIEW: Install the middleware plugins so that our app can use the body-parser module.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));


// REVIEW: Routes for requesting HTML resources
app.get('/new', (request, response) => {
  // DONE COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // From the diagram, this get request is also sending a response back of a file from the public directory. Numbers: 2, 5, and 1 (in order)
  // This is creating a route for new.html to be served, so it does not interact with article.js.
  // READ and CREATE (in order) 
  response.sendFile('new.html', {root: './public'});
});


// REVIEW: Routes for making API calls to use CRUD Operations on our database
app.get('/articles', (request, response) => {
  // DONE COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // This piece of code is a get request, as well as a query on our database. This means it is 2, 3, 4, and 5 from the diagram.
  // This piece of code is interacting with article.fetchAll();, because fetchAll() interacts with '/articles' and loads the results.
  // READ.
  client.query('SELECT * FROM articles')
    .then(function(result) {
      response.send(result.rows);
    })
    .catch(function(err) {
      console.error(err)
    })
});

app.post('/articles', (request, response) => {
  // DONE COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? 
  // This piece of code queries the DB and creates it with the request data. this means it is 3 and 4.  But since the data is initiated from the function on the article.js, then 2, 3, 4 and 5.  
  //Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // The Article.prototype.insertRecord method is interacting with this.  CRUD is Create.
  client.query(
    `INSERT INTO
    articles(title, author, "authorUrl", category, "publishedOn", body)
    VALUES ($1, $2, $3, $4, $5, $6);
    `,
    [
      request.body.title,
      request.body.author,
      request.body.authorUrl,
      request.body.category,
      request.body.publishedOn,
      request.body.body
    ]
  )
    .then(function() {
      response.send('insert complete')
    })
    .catch(function(err) {
      console.error(err);
    });
});

app.put('/articles/:id', (request, response) => {
  // DONE COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? 
  // This piece of code queries the DB and updates it with the request data. this means it is 3 and 4.  But since the data is initiated from the function on the article.js, then 2, 3, 4 and 5.
  //Which method of article.js is interacting with this particular piece of `server.js`? 
  //  Article.prototype.updateRecord
  //What part of CRUD is being enacted/managed by this particular piece of code?
  // Update
 
  client.query(
    `UPDATE articles
    SET
      title=$1, author=$2, "authorUrl"=$3, category=$4, "publishedOn"=$5, body=$6
    WHERE article_id=$7;
    `,
    [
      request.body.title,
      request.body.author,
      request.body.authorUrl,
      request.body.category,
      request.body.publishedOn,
      request.body.body,
      request.params.id
    ]
  )
    .then(() => {
      response.send('update complete')
    })
    .catch(err => {
      console.error(err);
    });
});

app.delete('/articles/:id', (request, response) => {
  // DONE COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? 
  // 2,3,4,5
  //Which method of article.js is interacting with this particular piece of `server.js`? 
  // Article.prototype.deleteRecord
  //What part of CRUD is being enacted/managed by this particular piece of code?
  // Delete
  client.query(
    `DELETE FROM articles WHERE article_id=$1;`,
    [request.params.id]
  )
    .then(() => {
      response.send('Delete complete')
    })
    .catch(err => {
      console.error(err);
    });
});

app.delete('/articles', (request, response) => {
  // DONE COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code? 
  // 2,3,4,5
  // Which method of article.js is interacting with this particular piece of `server.js`? 
  // Article.truncateTable
  // What part of CRUD is being enacted/managed by this particular piece of code?
  // Delete
  client.query(
    'DELETE FROM articles;'
  )
    .then(() => {
      response.send('Delete complete')
    })
    .catch(err => {
      console.error(err);
    });
});

// DONE COMMENT: What is this function invocation doing?
// this invokes the function that creates the table if it does not exist in the database, then invokes loadArticles().  
loadDB();

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});


//////// ** DATABASE LOADER ** ////////
////////////////////////////////////////
function loadArticles() {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code?
  // This function has a database query, as well as sending the results back to the server. 3 and 4 from the diagram.
  // Which method of article.js is interacting with this particular piece of `server.js`?
  // This piece of server.js doesn't interact with article.js.
  // What part of CRUD is being enacted/managed by this particular piece of code?
  // READ and CREATE
  client.query('SELECT COUNT(*) FROM articles')
    .then(result => {
    // REVIEW: result.rows is an array of objects that PostgreSQL returns as a response to a query.
    // If there is nothing on the table, then result.rows[0] will be undefined, which will make count undefined. parseInt(undefined) returns NaN. !NaN evaluates to true.
    // Therefore, if there is nothing on the table, line 158 will evaluate to true and enter into the code block.
      if(!parseInt(result.rows[0].count)) {
        fs.readFile('./public/data/hackerIpsum.json', (err, fd) => {
          JSON.parse(fd.toString()).forEach(ele => {
            client.query(`
              INSERT INTO
              articles(title, author, "authorUrl", category, "publishedOn", body)
              VALUES ($1, $2, $3, $4, $5, $6);
            `,
              [ele.title, ele.author, ele.authorUrl, ele.category, ele.publishedOn, ele.body]
            )
          })
        })
      }
    })
}

function loadDB() {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to the following line of code?
  // This piece of code queries the database to check if a table exists, and if it doesn't, it creates it. If it does exist, it calls loadArticles, which fills the table with parsed JSON objects. 3 and 4 from the diagram.
  // Which method of article.js is interacting with this particular piece of `server.js`?
  // This piece of code isn't directly interacting with article.js.
  // What part of CRUD is being enacted/managed by this particular piece of code?
  // If the table doesn't exist, it creates a table, and if the table does exist, then it creates records for the table. Double CREATE
  client.query(`
    CREATE TABLE IF NOT EXISTS articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      "authorUrl" VARCHAR (255),
      category VARCHAR(20),
      "publishedOn" DATE,
      body TEXT NOT NULL);`
  )
    .then(() => {
      loadArticles();
    })
    .catch(err => {
      console.error(err);
    });
}
