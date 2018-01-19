![CF](https://camo.githubusercontent.com/70edab54bba80edb7493cad3135e9606781cbb6b/687474703a2f2f692e696d6775722e636f6d2f377635415363382e706e67) Lab 08: SQL and PostgreSQL
===


## User Stories and Feature Tasks

*As a user, I want to store my articles in a database so that my articles are available for users from an external source.*

- Install and require the NPM PostgreSQL package `pg` in your server.js file.
- Make sure to complete the connection string.
  - Windows and Linux users: You should have retained the user/password from the pre-work for this course. Your OS may require that your connection string is composed of additional information including user and password. For example: `const conString = 'postgres://USER:PASSWORD@HOST:PORT/DBNAME'`;
  - Mac users: `const conString = 'postgres://localhost:5432'`;
- Pass the appropriate argument when instantiating a new Client.
- The articleView.js methods are different now that we are not accessing the JSON file directly, and instead retrieving the articles from a database. Therefore, we no longer need to export the JSON, so remove all code that was involved in performing this action.

*As a developer, I want to review my code base so that I have a deep understanding of its overall functionality.*

- Study each of the new routes in your server.js file by examining the SQL statements and any associated data being handed through the request.
- For each of the `COMMENT` items in server.js, provide a brief description of what that function immediately below is doing. Be sure to indicate, where applicable, details such as:
  - Which method of article.js is interacting with this particular piece of server.js?
  - What part of ***CRUD*** is being enacted/managed by this particular piece of code?
  - As applicable, an additional sentence or two of explanation about what the code is doing, what NPM packages are involved, etc. The goal is to demonstrate that you understand what is going on in the code without glossing over details, but also without writing a novel about it.

## Documentation


```
# INTRO TO SQL POSTGRES

**Author**: Keith Eckert & Christian Miller
**Version**: 1.0.0 

## Overview
- Today we added code to the server.js file to import and created and accessed a database for the project, and populated the database from the existing json file, and removed old code no longer required by implementing a server. 


## Architecture
-This project now uses Postgresql to store and access article data accessed by a local server through node express.  


## Credits and Collaborations
Christian Miller and Keith Eckert
```
