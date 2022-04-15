# Northcoders News BACKEND

## GENERAL INFORMATION

This is a News application created using Node.js, Express and PostreSQL. It is an Express server with RESTful endpoints that retrieves information from a PSQL database. Using Node.js and node-postres it will GET, POST, PATCH and DELETE data from the relevant database. As is standard for a restful API, it follows the model and controller architecture - models query the database passing the data back to the controllers where data is either passed back to the user or errors are handled.

This API can be interacted with by use of corresponding front end which serves up the data in an attractive and ergonomic way. The server was fully developed using test-driven development with Jest and Supertest.

## Getting Set-up

1) Clone this repository onto your local machine.



` $ git clone https://github.com/FreddieStoker7/BE-NC-news `

2) Navigate into the directory on command line:


`$ cd northcoders/BE-NC-news`

3) Open the directory in your code editor.


` $ code . (for VScode)`


4) Install all dependencies

`npm install`


5) Create two .env files in order to successfully connect to the two databases locally: **.env.test** and **.env.development**. Inside each, add `PGDATABASE=nc_news_test`, and `PGDATABASE=nc_news` respectively.

6) Create the databases by running the following command in your terminal:

`npm run setup-dbs`

7) Run the following command to seed the development database: 

 `npm run seed`


8) Finally to run the server locally enter the following command in your terminal:


`npm start`








****LINK TO HOSTED APPLICATION ON HEROKU:****
https://freddie-nc-news.herokuapp.com/api