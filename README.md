# README

- [README](#readme)
  - [Summary](#summary)
  - [First part](#first-part)
    - [Architecture](#architecture)
    - [Testing](#testing)
      - [How to run](#how-to-run)
    - [Getting set up](#getting-set-up)
    - [Improvements](#improvements)
    - [Problems I had](#problems-i-had)
      - [Problems with a feature](#problems-with-a-feature)
    - [What would I do if I had more time right now?](#what-would-i-do-if-i-had-more-time-right-now)
  - [Second part](#second-part)
    - [Data Models](#data-models)
      - [Profile](#profile)
      - [Contract](#contract)
      - [Job](#job)
    - [Getting Set Up](#getting-set-up-1)
  - [Technical Notes](#technical-notes)
    - [APIs To Implement](#apis-to-implement)
    - [Going Above and Beyond the Requirements](#going-above-and-beyond-the-requirements)
    - [Submitting the Assignment](#submitting-the-assignment)

---

## Summary

Hi Deel, I'm Daniel! It has been an amazing experience doing this exam for you.

This README will be splitted into two parts:

- `First part`: all my comments about the tests, and what I would like to do if I had more personal time at this moment.
- `Second part`: your original README. Your notes will be below my notes.

As a conclusion of all this technical assessment: I tried to do my best because I would love to work at Deel. I hope you like my work.

Please please and please (Hahaha): if something goes wrong or you have any doubts about something, please contact me. I would be happy to help you with whatever you need.

NOTE: to test the admin endpoints, please use user with `id` 9, which has `type` `admin`.

## First part

### Architecture

I tried to follow a `MVC pattern`, and I created a couple of folders to decouple the code, trying to manage easily each responsability of each file. The structure of the `src` folder is:

- `Controllers`: this is the first place where requests from users will have bussiness logic. As his name says, it controls the bussiness logic flow: calling functions of database; calling utilities; calling constants; and others.
- `Database`: allocates all related to database, like queries, inserts, updates, and others. This is the place to see all related to database. It means that neither the controller, nor other files, other than `database` files, should have database logic.
- `Exceptions`: allows custom exceptions.
  - `deelError.js`: I created this file to handle custom errors, but, this is not strictly mandatory and necessary in the application. I created this to show that I can create and use custom exceptions, but I could have used the native `Error` provided by Node.js
    ( Hahaha :) )
- `Middlewares`: middlewares that express will use.
  - `getProfile`: middleware that you provided me to authorize a user based on his type. I made a couple of changes in this method, allowing validate if the incoming user `type` is valid or not (according with the expected `type` sent as a parameter. (`getProfile` is used by the `routes` files, and each one handle his own authentication).
  - `errorsHandler`: middleware that catches known errors as unknown errors. I created this file to avoid putting a try/catch inside each controller to handle errors. Nahhhhh! It is more beautiful in this way (personal opinion, of course) Hahahaha.
- `Models`: the database models are created here, through `Sequelize`
- `Routes`: all the express routes are handled here. Since this file handles the middlewares for each route, there's a middleware that is used for type validations, through the `joi` library. So, each route calls the specific validation schema for the route that needs validation. It means that controllers don't do type validations.
- `Utilities`: commons and constants to be used anywhere.
- `Validations`: `joi` schemas to be used in `routes`.

### Testing

The tests are located in the `tests` folder. The framework used to create tests is `jest`. I did unit and integration tests for almost everything. I added a couple of comments of the tests in the section [here](#what-would-i-do-if-i-had-more-time-right-now).

#### How to run

To run the test suite, open a terminal and run `npm test`

### Getting set up

Same steps that you put [here](#getting-set-up-1)

### Improvements

- I added a couple of indexes, based on the queries that code does, to improve the database performance.
- I added a new model and table `Deposit`, to store the transactions when a deposit movement is requested.

### Problems I had

#### Problems with a feature

- I had problems understanding this feature you requested me:

**_POST_** `/balances/deposit/:userId` - Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)

The doubt is (I will try to explain):

I understand that there is a client who sends money to another client. That amount of money can't be greater than 25% of the total of his jobs to be paid. Let's imagine that I have 4 unpaid jobs, whose sum to pay is 2000. 25% of that is: 500. Now, let's imagine that this client wants to send 1000 as a deposit to another client. Given the instructions:

- Make a deposit for 500
- Make another deposit for the other 500.

After that explanation:

Is that the behavior you want?
If it is the behavior, what is the point of that? This is my confusion, because it doesn't make sense to me (Why not just make one deposit instead of two), or... I am not understanding something. If it is just for exam purposes, and there is no reason for that, hahaha, sorry for this email and I will do that feature as I explained.

I have another case:

- What would happen if the user doesn't have jobs to pay (because he already paid all of them). Based on the feature: He can't deposit anyone because the 25% of 0 (0 as value of 0 jobs to pay) is 0. So, I couldn't deposit money to anyone. Did I understand well?

To conclude: I did that feature based on what I understood, but... I don't feel comfortable if I did it as you expect. Plase, if you can explain me if I understood bad, I would try to send you a new version with that feature fixed.

`NOTE`: This is the only controller that doesn't have unit and integration tests. Following good practices of doing tests, I shouldn't create unit and/or integration tests for something that can change so much or that we are not sure about its functionality. If you say to me: `Hey Daniel, you understood the feature correctly`, immediately I would do this unit and/or integration tests.

- I want to tell about other thing, which is not really a problem. It is just for info. It is about the next features:

**_GET_** `/admin/best-profession?start=<date>&end=<date>` - Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.

**_GET_** `/admin/best-clients?start=<date>&end=<date>&limit=<integer>` - returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.

The thing is: you are talking about return data in the query time period. The column I had into account is `paymentDate` in the table `Jobs`. I used that colum because I didn't find a column which relates the start of the job, and the end date of the job. That's why I used that column for these queries.

### What would I do if I had more time right now?

- I was reading a lot about `Sequelize`, and some features could be great for this application:

  - `Optimistic locking`: trying to avoid multiple concurrent updates to a same register on a table, we can use that feature that `Sequelize` provide. Because the implementation need to change a little bit, I didn't do that, but... just imagine: 100 or more requests to a same register in the `Jobs` table to pay a job... it could be a disaster, and we can fix it with this feature. Of course, 100 or more requests to a same register in the `Jobs` table can be an attack and not a common use of the application, but we can avoid that.
  - `Sequelize` configuration: we can configure the max connections pool through parameters that `Sequelize` allows, to avoid consume all the connections of the database.

- Unit tests for `Joi` validation schemas. I didn't do that because it was time I used for other things in the application.

- Unit and integration tests separated from original database. The test suite uses the database you provide me. Each `npm test` drops the database. The right way for that is to use another database (inside in `tests` folder), not the original, to run the test suite. I preferred to use this time for other things in the application.

- I wanted to use `JMeter` to make big tests to the application, using concurrent requests. I used JMeter to test my features in the currently. I like it! It has helped me a lot.

## Second part

💫 Welcome! 🎉

This backend exercise involves building a Node.js/Express.js app that will serve a REST API. We imagine you should spend around 3 hours at implement this feature.

### Data Models

> **All models are defined in src/model.js**

#### Profile

A profile can be either a `client` or a `contractor`.
clients create contracts with contractors. contractor does jobs for clients and get paid.
Each profile has a balance property.

#### Contract

A contract between and client and a contractor.
Contracts have 3 statuses, `new`, `in_progress`, `terminated`. contracts are considered active only when in status `in_progress`
Contracts group jobs within them.

#### Job

contractor get paid for jobs by clients under a certain contract.

### Getting Set Up

The exercise requires [Node.js](https://nodejs.org/en/) to be installed. We recommend using the LTS version.

1. Start by cloning this repository.

1. In the repo root directory, run `npm install` to gather all dependencies.

1. Next, `npm run seed` will seed the local SQLite database. **Warning: This will drop the database if it exists**. The database lives in a local file `database.sqlite3`.

1. Then run `npm start` which should start both the server and the React client.

❗️ **Make sure you commit all changes to the master branch!**

## Technical Notes

- The server is running with [nodemon](https://nodemon.io/) which will automatically restart for you when you modify and save a file.

- The database provider is SQLite, which will store data in a file local to your repository called `database.sqlite3`. The ORM [Sequelize](http://docs.sequelizejs.com/) is on top of it. You should only have to interact with Sequelize - **please spend some time reading sequelize documentation before starting the exercise.**

- To authenticate users use the `getProfile` middleware that is located under src/middleware/getProfile.js. users are authenticated by passing `profile_id` in the request header. after a user is authenticated his profile will be available under `req.profile`. make sure only users that are on the contract can access their contracts.
- The server is running on port 3001.

### APIs To Implement

Below is a list of the required API's for the application.

1. **_GET_** `/contracts/:id` - This API is broken 😵! it should return the contract only if it belongs to the profile calling. better fix that!

1. **_GET_** `/contracts` - Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.

1. **_GET_** `/jobs/unpaid` - Get all unpaid jobs for a user (**_either_** a client or contractor), for **_active contracts only_**.

1. **_POST_** `/jobs/:job_id/pay` - Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.

1. **_POST_** `/balances/deposit/:userId` - Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)

1. **_GET_** `/admin/best-profession?start=<date>&end=<date>` - Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.

1. **_GET_** `/admin/best-clients?start=<date>&end=<date>&limit=<integer>` - returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.

```
 [
    {
        "id": 1,
        "fullName": "Reece Moyer",
        "paid" : 100.3
    },
    {
        "id": 200,
        "fullName": "Debora Martin",
        "paid" : 99
    },
    {
        "id": 22,
        "fullName": "Debora Martin",
        "paid" : 21
    }
]
```

### Going Above and Beyond the Requirements

Given the time expectations of this exercise, we don't expect anyone to submit anything super fancy, but if you find yourself with extra time, any extra credit item(s) that showcase your unique strengths would be awesome! 🙌

It would be great for example if you'd write some unit test / simple frontend demostrating calls to your fresh APIs.

### Submitting the Assignment

When you have finished the assignment, create a github repository and send us the link.

Thank you and good luck! 🙏
