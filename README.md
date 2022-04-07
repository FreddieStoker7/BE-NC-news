# Northcoders News BACKEND

GENERAL INFORMATION

This is a News application created using Node.js, Express and PostreSQL. It is an Express server with RESTful endpoints that retrieves information from a PSQL database. Using Node.js and node-postres it will GET, POST, PATCH and DELETE data from the relevant database. As is standard for a restful API, it follows the model and controller architecture - models query the database passing the data back to the controllers where data is either passed back to the user or errors are handled.

This API can be interacted with by use of corresponding front end which serves up the data in an attractive and ergonomic way. The server was fully developed using test-driven development with Jest and Supertest.

SETUP

1. Clone repository locally and install mandatory dependencies using npm install.

- dotenv: 16.0.0
- express: 4.17.3
- node-postgres: 0.6.2
- pg: 8.7.3
- husky: 7.0.0
- jest: 27.5.1
- jest-extended: 2.0.0
- jest-sorted: 1.0.14
- pg-format: 1.0.4
- supertest: 6.2.2

2. Create two .env files with correct database names set as the environment. For Example create the first file called '.env.test' and a second called '.env.development' in the root directory. Into each file add the line 'PGDATABASE=<insert_database_name_here>'. The link between these files and the databases has already been done in the './db/connection.js' file.

3. To seed the database the package.json has the following scripts available for the developer.
- setup-dbs: psql -f ./db/setup.sql
- seed: node ./db/seeds/run-seed.js
- test: jest

The setup-dbs drops (deletes) and creates our database. The seed script will seed the database. The test script will run all of the tests. 




****LINK TO HOSTED APPLICATION ON HEROKU:****
https://freddie-nc-news.herokuapp.com/api