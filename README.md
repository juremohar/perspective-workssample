# Backend Engineer Work Sample

This project skeleton contains a basic Express setup one endpoint to create a user and one endpoint to fetch all users, as well as a basic empty unit test.
I have used the prisma ORM for database managament. 

## Scripts 
`npm start` starts the server
`npm run migrate` creates and initiliaze database to the latest version
`npm run seed` seeds the database with dummy data
`npm test` executes the tests


## Usage
To access users endpoint you should use /api/users endpoint.
Example usages:
- `api/users?sort=-createdAt` (return users in descending order)
- `api/users?sort=createdAt` (return users in ascending order)
- `api/users` (return all users)

## Goal
1. Adjust POST /users that it accepts a user and stores it in a database.
    * The user should have a unique id, a name, a unique email address and a creation date
2. Adjust GET /users that it returns (all) users from the database.
   * This endpoint should be able to receive a query parameter `created` which sorts users by creation date ascending or descending.

Feel free to add or change this project as you like.


