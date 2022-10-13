# Qamar's House of Games API (Northcoders Bootcamp)

## Welcome!

To my back-end project that I wrote as part of my time at the Northcoders bootcamp.

In case you are eager to jump to taking a look at the final product, please find below a link at my suggested starting point: The endpoints guide.

https://qamars-b-end-proj-gamereviews.herokuapp.com/api

As that link so explicitly shows, it is being hosted with heroku for now until the free postgres addon is no longer available as of 28th November 2022.

## Summary of project

This project creates the back end for a game reviews database, allowing simple access to data using request paths defined using express.

For example, if you wanted to see all the reviews currently on the database, you could make GET request to /api/reviews

The functionality and integration of all the data goes a bit deeper, with there existing users, categories, comments data as well.
Each of which exists in their own table, but reference keys across each other to link data in a relational database.


## Technical details

The aim was to write a project whilst utilising and implementing all that I have learnt as part of the back-end teaching.
It was written with Test Driven Development so all the request paths were only written once they had a corresponding test for it first.

As part of this teaching I learnt to use a variety of popular back-end frameworks and other relevant packages, which I list for your perusal below:

- Node.js : To enable me to create the app. A solid choice given its popularity in industry alone and the packages available to enhance it further.
- Express : To write the handlers for the routing of requests.
- Postgres SQL : As the relational database management system of choice.
- Dotenv : For some added security.
- Jest & Supertest : To write effective tests.


Further to these, the code itself is written using the Model View Controller (MVC) pattern. So hopefully no single file is too cumbersome to read through.

The code itself was written using promises explicitly as opposed to using await. At this point in my learning I agree with the idea it keeps the async-ness of all this code at the forefront of one's mind.

If you're interested in running this project on your local machine, keep reading. :)

Otherwise, thanks for reading :D

----------------------------

## Initial Setup

0. Read through this whole README first. An important step on any endeavour.

1. Start by ensuring you have cloned this repo on your local machine first (if you desire fork it first). 

2. Once you have done this, open the file in your preferred code editor

3. Open your terminal in your code editor (double check the current directory is the root of the clone you made of this repo) and get get node package manager installed if not already by running this command in it
``` bash
    - npm init -y
```
4. Now we need the packages I utilised. In the same terminal run through these commands to get everything installed on your local machine if it isn't already:
``` bash
    - npm install dotenv
    - npm install pg
    - npm install express
    - npm install -D jest
    - npm install -D jest-sorted
    - npm install -D supertest
```
----------------------------
## ! Minimum Versions !

## Node: 17x Postgres: 8.7.x
----------------------------

### Local Database Setup

To successfully connect to the databases locally, you will need to create a .env.test and a .env.development file with the relevant setup for each.

-   For the .env.development file, please have it contain ONLY the following text:
``` js
    -   PGDATABASE=nc_games
```
-   For the .env.test file, please have it contain ONLY the following text:
``` js
    -   PGDATABASE=nc_games_test
``` 
It is very important that you are precise with this and that there are no typos.

See .env-example for an example.

## .gitignore

There is a .gitignore file already written that will ensure that the .env files are ignored along with the node_modules when pushing to github.

## Scripts

To actually enable the code to run, you will then need to run through some scripts:

1. For the database to be created on your machine, you need to run this command in your code editor terminal
``` bash
    - node run setup-dbs
``` 
2. Seeding of said databases can now be done via
``` bash
    - node run seed
``` 
3. However, for the tests this is written in at the top of the test files where needed to be ran before each 

4. Now I would suggest testing to see if everything is setup correctly, by running this in your terminal
``` bash
    - npm test
``` 
All tests should pass.

If you wish to run an individual test file, add the file path of the test file to the above command e.g.:
``` bash
- npm test __tests__/app.allothers.test.js 
```
