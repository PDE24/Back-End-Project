# PDE House of Games API

---

## Project Info

This is an API for a backend server and PSQL database. The api responds to specific request based on the endpoints provided.

The api accepts the following endpoints...

**GET**

        - /api
        - /api/categories
        - /api/reviews
        - /api/reviews/:review_id
        - /api/reviews/:review_id/comments
        - /api/users

**PATCH**

        - /api/reviews/:review_id

**POST**

        - /api/reviews/:review_id/comments

**DELETE**

        - /api/comments/:comment_id

## Hosted Site

Link to the hosted site here: https://pde-games.herokuapp.com

---

## Set up

Use `npm install` to ensure all dependancies are installed correctly.

You will need to create two .env files for your project: **.env.test** and **.env.development.**

> Into each, .env file add `PGDATABASE=<database_name_here>`, with the correct database name for that environment _(see /db/setup.sql for the database names)_.

### Seting up the database

Run both the setup-dbs & seed scripts.

`npm run setup-dbs`

`npm run setup-dbs`
